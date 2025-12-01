// routes/adminRoutes.js - Admin related routes

import express from 'express'; // Express framework import kiya
const router = express.Router(); // Router instance banaya admin routes ke liye

// Middleware import karte hain
import auth from '../middleware/auth.js'; // auth middleware - user logged in check karega
import isAdmin from '../middleware/isAdmin.js'; // isAdmin middleware - user admin hai ya nahi check karega
import upload from '../middleware/upload.js'; // upload middleware - file upload handle karega

// Controller functions import karte hain
import * as adminController from '../controllers/adminController.js'; // sabhi admin controller functions import kiye

// ============================================
// IMPORTANT NOTE:
// Ye saare routes auth AUR isAdmin dono middleware se protect hain
// Matlab:
// 1. User login hona chahiye (auth middleware)
// 2. User ka role 'admin' hona chahiye (isAdmin middleware)
// Tabhi access milega
// ============================================

// ============================================
// ADMIN DASHBOARD ROUTE
// ============================================

// GET /admin/dashboard - Admin dashboard page dikhane ke liye
router.get('/dashboard', auth, isAdmin, adminController.adminDashboard);
// auth middleware pehle check karega user logged in hai
// isAdmin middleware check karega user admin hai
// Phir adminDashboard function call hoga
// Response: Dashboard page with charts, stats, all users' tasks

// ============================================
// GET SINGLE TASK ROUTE (For Edit Modal)
// ============================================

// POST /admin/get-task - Ek specific task fetch karne ke liye
router.post('/get-task', auth, isAdmin, adminController.getTask);
// Request body me: { task_id: 'task_id' }
// Edit modal me task data dikhane ke liye use hota hai
// Response: Task object with all details

// ============================================
// UPDATE TASK ROUTE
// ============================================

// POST /admin/update-task - Task update karne ke liye
router.post('/update-task', auth, isAdmin, adminController.updateTask);
// Request body me:
// - task_id (task ka ID)
// - title (updated title)
// - priority (updated priority)
// - deadline (updated deadline)
// - completed (0 ya 1 - pending ya completed)
// Response: 'success' ya error message

// ============================================
// DELETE TASK ROUTE
// ============================================

// POST /admin/delete-task - Task delete karne ke liye
router.post('/delete-task', auth, isAdmin, adminController.deleteTask);
// Request body me: { task_id: 'task_id' }
// Task permanently delete ho jayega database se
// Response: 'success' ya 'task_not_found'

// ============================================
// SEND REMINDER EMAIL ROUTE
// ============================================

// POST /admin/send-reminder - Manual reminder email bhejne ke liye
router.post('/send-reminder', auth, isAdmin, adminController.sendReminder);
// Request body me: { task_id: 'task_id' }
// User ko task complete karne ka reminder email jayega
// Task me last_reminder_sent field update ho jayega
// Response: 'success' ya 'fail'

// ============================================
// EXPORT TASKS ROUTE (CSV Download)
// ============================================

// GET /admin/export-tasks - Saare tasks CSV format me download karne ke liye
router.get('/export-tasks', auth, isAdmin, adminController.exportTasks);
// Query parameter me format specify kar sakte hain: ?format=csv
// Response: CSV file download hogi
// CSV headers: ID, Title, User, Priority, Start Date, Deadline, Status

// ============================================
// SETTINGS ROUTE (Future use - agar settings page banana ho)
// ============================================

// GET /admin/settings - Settings page dikhane ke liye
router.get('/settings', auth, isAdmin, (req, res) => {
  res.render('settings', { user: req.user }); // settings.ejs render hoga
});

// POST /admin/save-settings - Settings save karne ke liye (with file upload)
router.post('/save-settings', auth, isAdmin, upload.single('website_logo'), (req, res) => {
  // upload.single('website_logo') - ek file upload handle karega
  // File ka naam 'website_logo' field se aayega
  // Uploaded file info req.file me milega
  // Settings save karne ka logic yahan likhenge
  try {
    // req.body me settings data hoga
    // req.file me uploaded logo file ka info hoga
    // Example: req.file.filename, req.file.path
    
    // Settings save karo database me
    // ...
    
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Save Settings Error:', error);
    res.status(500).json({ success: false, message: 'Failed to save settings' });
  }
});

// ============================================
// USAGE EXAMPLES (Frontend - Admin Dashboard):
// ============================================

/*
// Get single task for editing
$.post('/admin/get-task', { task_id: taskId }, function(task) {
  // Fill edit modal with task data
  $('#editTitle').val(task.title);
  $('#editPriority').val(task.priority);
});

// Update task
$.post('/admin/update-task', {
  task_id: taskId,
  title: 'Updated Title',
  priority: 'High',
  deadline: '2025-12-31',
  completed: '1'
}, function(response) {
  if (response === 'success') {
    alert('Task updated!');
  }
});

// Delete task
$.post('/admin/delete-task', { task_id: taskId }, function(response) {
  if (response === 'success') {
    alert('Task deleted!');
  }
});

// Send reminder
$.post('/admin/send-reminder', { task_id: taskId }, function(response) {
  if (response === 'success') {
    alert('Reminder sent!');
  }
});

// Export tasks to CSV
window.location.href = '/admin/export-tasks?format=csv';
*/

// Router ko export karte hain
export default router;