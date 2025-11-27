const Task = require('../models/Task');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// Manager creates task (multer sets req.file)
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline, priority } = req.body;
    const file = req.file ? req.file.filename : null;

    // ensure assignedTo exists and is employee of manager (optional)
    const assignee = await User.findById(assignedTo);
    if (!assignee) return res.status(404).json({ message: 'Assigned user not found' });

    const task = new Task({
      title,
      description,
      file,
      assignedBy: req.user._id,
      assignedTo,
      deadline: deadline ? new Date(deadline) : null,
      priority: priority || 'medium',
      status: 'assigned'
    });
    await task.save();

    // notify assigned user by email
    if (assignee.email) {
      await sendEmail(assignee.email, 'New Task Assigned', `A new task "${title}" has been assigned to you by ${req.user.name}`);
    }

    res.json({ message: 'Task created', task });
  } catch (err) {
    console.error('Create task error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Manager: list tasks assigned by this manager
exports.getTasksAssignedByMe = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedBy: req.user._id }).populate('assignedTo assignedBy').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

// Employee: list my tasks
exports.getMyTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'user') {
      tasks = await Task.find({ assignedTo: req.user._id }).populate('assignedBy assignedTo').sort({ createdAt: -1 });
    } else if (req.user.role === 'manager') {
      tasks = await Task.find({ assignedBy: req.user._id }).populate('assignedBy assignedTo').sort({ createdAt: -1 });
    } else if (req.user.role === 'admin') {
      tasks = await Task.find().populate('assignedBy assignedTo').sort({ createdAt: -1 });
    }
    res.json(tasks);
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

// Employee claims task
exports.claimTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (String(task.assignedTo) !== String(req.user._id)) return res.status(403).json({ message: 'Not your task' });

    task.status = 'claimed';
    task.claimedAt = new Date();
    await task.save();
    res.json({ message: 'Task claimed', task });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

// Employee completes task -> notify manager + admin
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedBy assignedTo');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (String(task.assignedTo) !== String(req.user._id)) return res.status(403).json({ message: 'Not your task' });

    task.status = 'completed';
    task.completedAt = new Date();
    await task.save();

    // notify manager
    if (task.assignedBy && task.assignedBy.email) {
      await sendEmail(task.assignedBy.email, 'Task Completed', `${req.user.name} completed task "${task.title}"`);
    }
    // notify all admins
    const admins = await User.find({ role: 'admin' });
    for (let a of admins) {
      if (a.email) await sendEmail(a.email, 'Task Completed (Admin)', `${req.user.name} completed "${task.title}" assigned by ${task.assignedBy?.name || 'Unknown'}`);
    }

    res.json({ message: 'Task completed', task });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};
