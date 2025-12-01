// controllers/adminController.js
import User from "../models/User.js";
import Task from "../models/Task.js";

export const adminDashboard = async (req, res) => {
  // सिर्फ़ admin access होना चाहिए (route middleware handle करेगा)
  const totalEmployees = await User.countDocuments({ role: "employee" });
  const totalManagers = await User.countDocuments({ role: "manager" });
  const totalTasks = await Task.countDocuments();
  const completed = await Task.countDocuments({ status: "completed" });
  const pending = await Task.countDocuments({ status: "assigned" });

  const taskList = await Task.find().populate("assignedTo assignedBy");

  res.json({
    stats: { totalEmployees, totalManagers, totalTasks, completed, pending },
    taskList
  });
};
