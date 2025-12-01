// routes/taskRoutes.js - Task related routes

import express from 'express'; // Express framework import kiya
const router = express.Router(); // Router instance banaya tasks ke liye

// Middleware import karte hain
import auth from '../middleware/auth.js'; // auth middleware import kiya - user logged in check karega

// Controller functions import karte hain
import * as taskController from '../controllers/taskController.js'; // sabhi task controller functions import kiye

// ============================================
// IMPORTANT NOTE:
// Ye saare routes auth middleware ke saath protect hain
// Matlab user login hona chahiye tab hi access ho sakta hai
// ============================================

// ============================================
// GET TASKS ROUTE
// ============================================

// GET /tasks/get - User ke saare tasks fetch karne ke liye
router.get('/get', auth, taskController.getTasks);
// Query parameter me user_id pass kar sakte hain: /tasks/get?user_id=123
// Ya phir middleware se req.user.id automatically use hoga
// Response: JSON array of tasks

// ============================================
// SAVE TASK ROUTE (Create/Update)
// ============================================

// POST /tasks/save - Naya task create ya existing task update karne ke liye
router.post('/save', auth, taskController.saveTask);
// Request body me ye fields honge:
// - task_id (optional - agar hai to update, nahi to create)
// - user_id (user ka ID)
// - title (task ka title)
// - description (task ki details)
// - start_date (task start date)
// - deadline (task ki deadline)
// - priority (Low/Medium/High)
// Response: { success: true, message: '...' }

// ============================================
// DELETE TASK ROUTE
// ============================================

// POST /tasks/delete - Task delete karne ke liye
router.post('/delete', auth, taskController.deleteTask);
// Request body me: { id: 'task_id' }
// Response: { success: true, message: 'Task deleted successfully' }

// ============================================
// COMPLETE TASK ROUTE
// ============================================

// POST /tasks/complete - Task ko complete mark karne ke liye
router.post('/complete', auth, taskController.completeTask);
// Request body me: { id: 'task_id' }
// Task ka completed field true ho jayega
// Response: { success: true, message: 'Task marked as completed' }

// ============================================
// GET TASK STATS ROUTE
// ============================================

// GET /tasks/stats - Dashboard ke liye task statistics
router.get('/stats', auth, taskController.getTaskStats);
// Response: { total: 10, completed: 5, pending: 5 }
// Total tasks, completed tasks aur pending tasks count

// ============================================
// USAGE EXAMPLES (Frontend):
// ============================================

/*
// Get all tasks
$.get('/tasks/get?user_id=' + userId, function(tasks) {
  console.log(tasks);
});

// Create new task
$.post('/tasks/save', {
  user_id: userId,
  title: 'New Task',
  description: 'Task details',
  start_date: '2025-01-01',
  deadline: '2025-12-31',
  priority: 'High'
}, function(response) {
  console.log(response.message);
});

// Mark task as complete
$.post('/tasks/complete', { id: taskId }, function(response) {
  console.log(response.message);
});

// Delete task
$.post('/tasks/delete', { id: taskId }, function(response) {
  console.log(response.message);
});

// Get stats
$.get('/tasks/stats', function(stats) {
  console.log('Total:', stats.total);
  console.log('Completed:', stats.completed);
  console.log('Pending:', stats.pending);
});
*/

// Router ko export karte hain
export default router;