// controllers/adminController.js - Admin related operations

import Task from '../models/Task.js'; // Task model import kiya

import { sendReminderEmail } from '../utils/mailer.js'; // Reminder email function import kiya

// ============================================
// ADMIN DASHBOARD PAGE SHOW KARNE KE LIYE
// ============================================
export const adminDashboard = async (req, res) => {
  try {
    // Admin user ka data middleware se
    const user = req.user; // User object
    
    // Summary data fetch karte hain (Total, Completed, Pending tasks)
    const total = await Task.countDocuments(); // Total tasks count
    const completed = await Task.countDocuments({ completed: true }); // Completed count
    const pending = await Task.countDocuments({ completed: false }); // Pending count
    
    // Priority wise distribution fetch karte hain
    const priorityData = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }, // Priority ke according group kiya
      { $project: { priority: '$_id', count: 1, _id: 0 } } // Output format change kiya
    ]);
    
    // User wise task distribution fetch karte hain
    const userTaskData = await Task.aggregate([
      { 
        $lookup: { // User collection se data join kiya
          from: 'users', // Collection name
          localField: 'user_id', // Task me field
          foreignField: '_id', // User collection me field
          as: 'user' // Result array ka naam
        }
      },
      { $unwind: '$user' }, // Array ko object me convert kiya
      { 
        $group: { // User ke according group kiya
          _id: '$user._id', 
          name: { $first: '$user.name' }, 
          task_count: { $sum: 1 } 
        }
      },
      { $sort: { task_count: -1 } }, // Task count ke according descending sort
      { $project: { name: 1, task_count: 1, _id: 0 } } // Output format
    ]);
    
    // Saare tasks fetch karte hain with user details
    const tasks = await Task.find()
      .populate('user_id', 'name email') // User ka naam aur email bhi include kiya
      .sort({ deadline: 1 }); // Deadline ke according sort
    
    // Admin dashboard render karte hain saare data ke saath
    res.render('admin_dashboard', {
      user, // Logged in admin user
      summary: { total, completed, pending }, // Task summary
      priorityData, // Priority distribution
      userTaskData, // User task distribution
      tasks // All tasks list
    });
  } catch (error) {
    // Error handling
    console.error('Admin Dashboard Error:', error); // Error console me
    res.status(500).send('Server Error'); // 500 error
  }
};

// ============================================
// SINGLE TASK GET KARNE KE LIYE (Edit ke liye)
// ============================================
export const getTask = async (req, res) => {
  try {
    // Request body se task ID extract karte hain
    const taskId = req.body.task_id; // Task ID
    
    // Task fetch karte hain ID se
    const task = await Task.findById(taskId); // Task search kiya
    
    if (!task) {
      // Agar task nahi mila to 404 error
      return res.status(404).send('Task not found'); // 404 status
    }
    
    // Task ko JSON me bhej dete hain
    res.json(task); // Task object response me
  } catch (error) {
    // Error handling
    console.error('Get Task Error:', error); // Error console me
    res.status(500).send('Server Error'); // 500 error
  }
};

// ============================================
// TASK UPDATE KARNE KE LIYE (Admin)
// ============================================
export const updateTask = async (req, res) => {
  try {
    // Request body se data extract karte hain
    const { task_id, title, priority, deadline, completed } = req.body;
    
    // Validation - Required fields check karte hain
    if (!title || !priority || !deadline) {
      return res.status(400).send('missing_fields'); // 400 bad request
    }
    
    // Priority validation
    if (!['Low', 'Medium', 'High'].includes(priority)) {
      return res.status(400).send('invalid_priority'); // Invalid priority
    }
    
    // Task ko update karte hain
    await Task.findByIdAndUpdate(task_id, {
      title, // Title update
      priority, // Priority update
      deadline, // Deadline update
      completed: completed === '1' // Completed string to boolean convert kiya
    });
    
    res.send('success'); // Success response
  } catch (error) {
    // Error handling
    console.error('Update Task Error:', error); // Error console me
    res.status(500).send('database_error'); // 500 error
  }
};

// ============================================
// TASK DELETE KARNE KE LIYE (Admin)
// ============================================
export const deleteTask = async (req, res) => {
  try {
    // Request body se task ID extract karte hain
    const taskId = req.body.task_id; // Task ID
    
    // Task delete karte hain
    const result = await Task.findByIdAndDelete(taskId); // Task delete ho gaya
    
    if (!result) {
      // Agar task nahi mila to 404
      return res.status(404).send('task_not_found'); // Task not found
    }
    
    res.send('success'); // Success response
  } catch (error) {
    // Error handling
    console.error('Delete Task Error:', error); // Error console me
    res.status(500).send('database_error'); // 500 error
  }
};

// ============================================
// REMINDER EMAIL BHEJNE KE LIYE (Admin)
// ============================================
export const sendReminder = async (req, res) => {
  try {
    // Request body se task ID extract karte hain
    const taskId = req.body.task_id; // Task ID
    
    // Task fetch karte hain with user details
    const task = await Task.findById(taskId).populate('user_id'); // Task aur user data
    
    if (!task) {
      // Agar task nahi mila
      return res.send('invalid_task'); // Invalid task
    }
    
    // Reminder email bhejte hain
    await sendReminderEmail(
      task.user_id.email, // User ki email
      task.user_id.name, // User ka naam
      task.title, // Task title
      task.description, // Task description
      task.deadline // Task deadline
    );
    
    // Last reminder sent date update karte hain
    task.last_reminder_sent = new Date(); // Current date set kar diya
    await task.save(); // Task save kar diya
    
    res.send('success'); // Success response
  } catch (error) {
    // Error handling
    console.error('Send Reminder Error:', error); // Error console me
    res.send('fail'); // Fail response
  }
};

// ============================================
// TASKS EXPORT KARNE KE LIYE CSV FORMAT ME
// ============================================
export const exportTasks = async (req, res) => {
  try {
    // Saare tasks fetch karte hain with user details
    const tasks = await Task.find()
      .populate('user_id', 'name email') // User details include kiye
      .sort({ deadline: 1 }); // Deadline ke according sort
    
    // CSV headers
    let csv = 'ID,Title,User,Priority,Start Date,Deadline,Status\n'; // Header row
    
    // Har task ko CSV row me convert karte hain
    tasks.forEach(task => {
      csv += `${task._id},`; // Task ID
      csv += `"${task.title}",`; // Title (quotes me wrapped for safety)
      csv += `"${task.user_id.name}",`; // User name
      csv += `${task.priority},`; // Priority
      csv += `${task.start_date.toISOString().split('T')[0]},`; // Start date (YYYY-MM-DD format)
      csv += `${task.deadline.toISOString().split('T')[0]},`; // Deadline
      csv += `${task.completed ? 'Completed' : 'Pending'}\n`; // Status
    });
    
    // CSV file download ke liye headers set karte hain
    res.setHeader('Content-Type', 'text/csv'); // Content type CSV
    res.setHeader('Content-Disposition', 'attachment; filename=all_tasks.csv'); // Download filename
    res.send(csv); // CSV data send kar diya
  } catch (error) {
    // Error handling
    console.error('Export Tasks Error:', error); // Error console me
    res.status(500).send('Export failed'); // 500 error
  }
};