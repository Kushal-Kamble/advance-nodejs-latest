// controllers/taskController.js - Task related operations

import Task from '../models/Task.js'; // Task model import kiya
import User from '../models/User.js'; // User model import kiya
import { sendTaskEmail } from '../utils/mailer.js'; // Email bhejne ka function import kiya

// ============================================
// SAARE TASKS GET KARNE KE LIYE (User ke tasks)
// ============================================
export const getTasks = async (req, res) => {
  try {
    // Query parameters se user_id extract karte hain
    const userId = req.query.user_id || req.user.id; // URL se ya middleware se user ID
    
    // User ke saare tasks fetch karte hain, deadline ke according sort karke
    const tasks = await Task.find({ user_id: userId })
      .sort({ deadline: 1 }); // 1 means ascending order (purane pehle)
    
    // Tasks ko JSON format me bhej dete hain
    res.json(tasks); // Response me tasks array
  } catch (error) {
    // Error handling
    console.error('Get Tasks Error:', error); // Error console me
    res.status(500).json({ error: 'Failed to fetch tasks' }); // 500 status code ke saath error
  }
};

// ============================================
// TASK CREATE YA UPDATE KARNE KE LIYE
// ============================================
export const saveTask = async (req, res) => {
  try {
    // Request body se data extract karte hain
    const { task_id, user_id, title, description, start_date, deadline, priority } = req.body;
    
    // Agar task_id hai to update karna hai
    if (task_id) {
      // Existing task ko update karte hain
      await Task.findByIdAndUpdate(task_id, {
        title, // Title update
        description, // Description update
        start_date, // Start date update
        deadline, // Deadline update
        priority // Priority update
      });
      
      res.json({ success: true, message: 'Task updated successfully' }); // Success response
    } else {
      // Naya task create karte hain
      const newTask = await Task.create({
        user_id, // User ka ID
        title, // Task title
        description, // Task description
        start_date, // Start date
        deadline, // Deadline
        priority // Priority
      });
      
      // User ka data fetch karte hain email bhejne ke liye
      const user = await User.findById(user_id); // User ID se user search kiya
      
      // Task create hone ka email bhejte hain
      await sendTaskEmail(
        user.email, // User ki email
        user.name, // User ka naam
        title, // Task title
        description, // Task description
        deadline // Task deadline
      );
      
      res.json({ success: true, message: 'Task created successfully' }); // Success response
    }
  } catch (error) {
    // Error handling
    console.error('Save Task Error:', error); // Error console me
    res.status(500).json({ error: 'Failed to save task' }); // 500 status code
  }
};

// ============================================
// TASK DELETE KARNE KE LIYE
// ============================================
export const deleteTask = async (req, res) => {
  try {
    // Request body se task ID extract karte hain
    const { id } = req.body; // Task ID
    
    // Task ko database se delete karte hain
    await Task.findByIdAndDelete(id); // Task delete ho gaya
    
    res.json({ success: true, message: 'Task deleted successfully' }); // Success response
  } catch (error) {
    // Error handling
    console.error('Delete Task Error:', error); // Error console me
    res.status(500).json({ error: 'Failed to delete task' }); // 500 status code
  }
};

// ============================================
// TASK COMPLETE MARK KARNE KE LIYE
// ============================================
export const completeTask = async (req, res) => {
  try {
    // Request body se task ID extract karte hain
    const { id } = req.body; // Task ID
    
    // Task ko complete mark karte hain
    await Task.findByIdAndUpdate(id, { completed: true }); // completed field true ho gayi
    
    res.json({ success: true, message: 'Task marked as completed' }); // Success response
  } catch (error) {
    // Error handling
    console.error('Complete Task Error:', error); // Error console me
    res.status(500).json({ error: 'Failed to complete task' }); // 500 status code
  }
};

// ============================================
// TASK STATS GET KARNE KE LIYE (Dashboard ke liye)
// ============================================
export const getTaskStats = async (req, res) => {
  try {
    // Middleware se user ID extract karte hain
    const userId = req.user.id; // User ka ID
    
    // Total tasks count karte hain
    const total = await Task.countDocuments({ user_id: userId }); // Total tasks
    
    // Completed tasks count karte hain
    const completed = await Task.countDocuments({ 
      user_id: userId, 
      completed: true 
    }); // Completed tasks
    
    // Pending tasks count karte hain
    const pending = await Task.countDocuments({ 
      user_id: userId, 
      completed: false 
    }); // Pending tasks
    
    // Stats ko JSON me bhej dete hain
    res.json({ total, completed, pending }); // Response me stats object
  } catch (error) {
    // Error handling
    console.error('Get Stats Error:', error); // Error console me
    res.status(500).json({ error: 'Failed to fetch stats' }); // 500 status code
  }
};
