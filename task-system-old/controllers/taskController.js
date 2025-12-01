// controllers/taskController.js
import Task from "../models/Task.js";
import TaskHistory from "../models/TaskHistory.js";
import User from "../models/User.js";
import { sendMail } from "../utils/mailer.js";
import dotenv from "dotenv";
dotenv.config();

// ---------------- CREATE TASK (Manager assigns to employee) ----------------
export const createTask = async (req, res) => {
  try {
    // manager only route - route should use allowRoles('manager')
    const { title, description, dueDate, employeeId } = req.body;

    const employee = await User.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const task = await Task.create({
      title,
      description,
      assignedBy: req.user._id,
      assignedTo: employeeId,
      dueDate: dueDate ? new Date(dueDate) : null
    });

    await TaskHistory.create({ taskId: task._id, action: "Assigned", userId: req.user._id });

    // manager ने assign किया -> employee को email भेजना (optional)
    await sendMail({
      to: employee.email,
      subject: `New Task Assigned: ${title}`,
      text: `A new task has been assigned to you. Due: ${dueDate || "N/A"}`
    });

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- EMPLOYEE: Get their tasks ----------------
export const getEmployeeTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate("assignedBy", "firstName lastName email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- MANAGER: Get tasks created by this manager ----------------
export const getManagerTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedBy: req.user._id }).populate("assignedTo", "firstName lastName email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- CLAIM TASK (employee) ----------------
export const claimTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // only assignedTo can claim
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can't claim this task" });
    }

    task.status = "claimed";
    await task.save();
    await TaskHistory.create({ taskId, action: "Claimed", userId: req.user._id });
    res.json({ message: "Task claimed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPLOAD attachments (multer) & mark completed ----------------
export const uploadAttachmentsAndComplete = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId).populate("assignedBy assignedTo");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // only assignedTo can complete
    if (task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can't complete this task" });
    }

    // files from multer (req.files)
    const files = req.files || [];
    files.forEach(f => {
      task.attachments.push({ filename: f.originalname, path: `/uploads/${f.filename}` });
    });

    task.status = "completed";
    await task.save();

    await TaskHistory.create({ taskId, action: "Completed", userId: req.user._id });

    // Notify manager and admin by email
    const manager = await User.findById(task.assignedBy);
    const adminEmail = process.env.ADMIN_EMAIL;
    const subject = `Task Completed: ${task.title}`;

    await sendMail({ to: manager.email, subject, text: `Employee ${req.user.firstName} completed the task.` });
    if (adminEmail) await sendMail({ to: adminEmail, subject, text: `Task completed by ${req.user.firstName} (manager: ${manager.email})` });

    res.json({ message: "Task completed and notifications sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- MANAGER: Approve/Close Task ----------------
export const closeTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // only manager who assigned can close
    if (task.assignedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can't close this task" });
    }

    task.status = "closed";
    await task.save();
    await TaskHistory.create({ taskId, action: "Closed", userId: req.user._id });

    res.json({ message: "Task closed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
