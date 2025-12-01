// utils/cronJob.js - Automatic reminder cron job

import cron from 'node-cron'; // node-cron library import kiya scheduled tasks ke liye
import Task from '../models/Task.js'; // Task model import kiya
import User from '../models/User.js'; // User model import kiya
import { sendReminderEmail } from './mailer.js'; // Email function import kiya

// ============================================
// CRON JOB EXPLANATION:
// ============================================
// Cron syntax: * * * * * (5 fields)
// Field 1: Minute (0-59)
// Field 2: Hour (0-23)
// Field 3: Day of Month (1-31)
// Field 4: Month (1-12)
// Field 5: Day of Week (0-7, where 0 and 7 = Sunday)
//
// Examples:
// '0 9 * * *'     = Every day at 9:00 AM
// '*/10 * * * *'  = Every 10 minutes
// '0 0 * * 0'     = Every Sunday at midnight
// '30 8 * * 1-5'  = Monday to Friday at 8:30 AM
// ============================================

// ============================================
// CRON JOB 1: DAILY REMINDER CHECK
// ============================================
// Ye job har din subah 9 baje chalega aur pending tasks ke liye reminder bhejega
const dailyReminderJob = cron.schedule('0 9 * * *', async () => {
  // '0 9 * * *' matlab: Minute=0, Hour=9, har din, har mahina, har day of week
  // Matlab: Daily at 9:00 AM
  
  console.log('⏰ Running Daily Reminder Cron Job at', new Date().toLocaleString());
  
  try {
    // Aaj ki date nikal lete hain
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Time ko 00:00:00 set kar diya
    
    // Kal ki date nikali (deadline check ke liye)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Kal ki date
    
    // 3 din baad ki date (early warning ke liye)
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    
    // Pending tasks fetch karte hain jo:
    // 1. Complete nahi hui hain
    // 2. Deadline aaj se 3 din ke andar hai
    // 3. Aaj reminder nahi bheji hai (last_reminder_sent check)
    const pendingTasks = await Task.find({
      completed: false, // Task complete nahi hui
      deadline: { 
        $gte: today, // Deadline aaj ya baad me hai (overdue nahi)
        $lte: threeDaysLater // Deadline agle 3 din ke andar hai
      },
      $or: [ // OR condition - do me se ek true hona chahiye
        { last_reminder_sent: null }, // Kabhi reminder nahi bheji
        { last_reminder_sent: { $lt: today } } // Last reminder aaj se pehle bheji thi
      ]
    }).populate('user_id'); // User ka data bhi fetch kar liya
    
    console.log(`📧 Found ${pendingTasks.length} tasks requiring reminders`);
    
    // Counter for successful emails
    let emailsSent = 0;
    let emailsFailed = 0;
    
    // Har task ke liye reminder bhejte hain
    for (const task of pendingTasks) {
      try {
        // Reminder email bhejte hain
        const emailSent = await sendReminderEmail(
          task.user_id.email, // User ki email
          task.user_id.name, // User ka naam
          task.title, // Task title
          task.description, // Task description
          task.deadline // Task deadline
        );
        
        if (emailSent) {
          // Email successfully bheji gayi to last_reminder_sent update karte hain
          task.last_reminder_sent = new Date(); // Aaj ki date set kar di
          await task.save(); // Task save kar diya
          emailsSent++; // Counter increment
          console.log(`✅ Reminder sent for task: ${task.title} to ${task.user_id.email}`);
        } else {
          emailsFailed++;
          console.log(`❌ Failed to send reminder for task: ${task.title}`);
        }
      } catch (error) {
        emailsFailed++;
        console.error(`❌ Error sending reminder for task ${task.title}:`, error.message);
      }
    }
    
    // Summary log
    console.log(`📊 Reminder Summary: ${emailsSent} sent, ${emailsFailed} failed`);
  } catch (error) {
    console.error('❌ Daily Reminder Cron Job Error:', error.message);
  }
});

// ============================================
// CRON JOB 2: OVERDUE TASKS CHECK (Optional)
// ============================================
// Ye job har 6 ghante me chalega aur overdue tasks check karega
const overdueTasksJob = cron.schedule('0 */6 * * *', async () => {
  // '0 */6 * * *' matlab: Every 6 hours (at minute 0)
  // 12:00 AM, 6:00 AM, 12:00 PM, 6:00 PM
  
  console.log('🚨 Running Overdue Tasks Check at', new Date().toLocaleString());
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Overdue tasks find karte hain (deadline nikal chuki hai)
    const overdueTasks = await Task.find({
      completed: false, // Pending hai
      deadline: { $lt: today }, // Deadline nikal gayi
      $or: [
        { last_reminder_sent: null }, // Reminder nahi bheji
        { last_reminder_sent: { $lt: today } } // Aaj reminder nahi bheji
      ]
    }).populate('user_id');
    
    console.log(`🚨 Found ${overdueTasks.length} overdue tasks`);
    
    let emailsSent = 0;
    
    // Har overdue task ke liye urgent reminder bhejte hain
    for (const task of overdueTasks) {
      try {
        const emailSent = await sendReminderEmail(
          task.user_id.email,
          task.user_id.name,
          task.title,
          task.description,
          task.deadline
        );
        
        if (emailSent) {
          task.last_reminder_sent = new Date();
          await task.save();
          emailsSent++;
          console.log(`🚨 Urgent reminder sent for overdue task: ${task.title}`);
        }
      } catch (error) {
        console.error(`❌ Error sending overdue reminder:`, error.message);
      }
    }
    
    console.log(`📊 Overdue Reminders: ${emailsSent} sent`);
  } catch (error) {
    console.error('❌ Overdue Tasks Cron Job Error:', error.message);
  }
});

// ============================================
// CRON JOB 3: WEEKLY SUMMARY (Optional)
// ============================================
// Ye job har Monday subah 8 baje chalega aur weekly summary email bhejega
const weeklySummaryJob = cron.schedule('0 8 * * 1', async () => {
  // '0 8 * * 1' matlab: Every Monday at 8:00 AM (1 = Monday)
  
  console.log('📊 Running Weekly Summary Job at', new Date().toLocaleString());
  
  try {
    // Saare users fetch karte hain
    const users = await User.find();
    
    for (const user of users) {
      // Har user ke tasks ka summary nikaalte hain
      const totalTasks = await Task.countDocuments({ user_id: user._id });
      const completedTasks = await Task.countDocuments({ user_id: user._id, completed: true });
      const pendingTasks = await Task.countDocuments({ user_id: user._id, completed: false });
      
      // Summary email bhej sakte hain (function aap banayenge)
      // await sendWeeklySummaryEmail(user.email, user.name, totalTasks, completedTasks, pendingTasks);
      
      console.log(`📧 Weekly summary for ${user.name}: Total=${totalTasks}, Completed=${completedTasks}, Pending=${pendingTasks}`);
    }
  } catch (error) {
    console.error('❌ Weekly Summary Job Error:', error.message);
  }
});

// ============================================
// CRON JOBS START KARTE HAIN
// ============================================
console.log('✅ Cron Jobs Initialized:');
console.log('   📅 Daily Reminder: Every day at 9:00 AM');
console.log('   🚨 Overdue Check: Every 6 hours');
console.log('   📊 Weekly Summary: Every Monday at 8:00 AM');

// ============================================
// MANUAL TRIGGER FUNCTIONS (Testing ke liye)
// ============================================

// Daily reminder manually trigger karne ke liye
export const triggerDailyReminder = async () => {
  console.log('🔧 Manually triggering Daily Reminder Job...');
  dailyReminderJob.now(); // Immediately run kar dega
};

// Overdue tasks check manually trigger karne ke liye
export const triggerOverdueCheck = async () => {
  console.log('🔧 Manually triggering Overdue Check Job...');
  overdueTasksJob.now();
};

// Weekly summary manually trigger karne ke liye
export const triggerWeeklySummary = async () => {
  console.log('🔧 Manually triggering Weekly Summary Job...');
  weeklySummaryJob.now();
};

// ============================================
// CRON JOBS STOP KARNE KE LIYE (Server shutdown pe)
// ============================================
export const stopAllCronJobs = () => {
  dailyReminderJob.stop();
  overdueTasksJob.stop();
  weeklySummaryJob.stop();
  console.log('🛑 All Cron Jobs Stopped');
};

// ============================================
// TESTING: Development me immediate test karne ke liye
// ============================================
// Agar testing karna hai to ye uncomment kar do:
// setTimeout(() => {
//   console.log('🧪 Testing cron job immediately...');
//   triggerDailyReminder();
// }, 5000); // 5 seconds baad run hoga