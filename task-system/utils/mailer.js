// utils/mailer.js - Email sending functions using Nodemailer

import nodemailer from 'nodemailer'; // Nodemailer library import kiya email bhejne ke liye
import dotenv from 'dotenv'; // Environment variables use karne ke liye
dotenv.config(); // .env file load kar li

// ============================================
// EMAIL TRANSPORTER SETUP
// ============================================
// Transporter ek object hai jo email bhejne ka kaam karta hai
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // SMTP host - .env se liya (email-smtp.us-east-1.amazonaws.com)
  port: process.env.EMAIL_PORT, // SMTP port - .env se liya (2587)
  secure: false, // TLS use karenge (port 2587 ke liye false, 465 ke liye true hota hai)
  auth: {
    user: process.env.EMAIL_USER, // SMTP username - .env se liya
    pass: process.env.EMAIL_PASS  // SMTP password - .env se liya
  }
});

// ============================================
// FUNCTION 1: TASK CREATE HONE PE EMAIL BHEJNE KE LIYE
// ============================================
// Jab naya task create hoga tab user ko notification email jayegi
export const sendTaskEmail = async (toEmail, toName, taskTitle, taskDesc, taskDeadline) => {
  try {
    // Email ka HTML content banate hain
    const htmlContent = `
      <div style="max-width:600px; margin:auto; border:1px solid #eaeaea; border-radius:8px; font-family:sans-serif;">
        <!-- Header Section - Blue background -->
        <div style="background:#003366; color:#fff; padding:20px; text-align:center; font-size:18px;">
          🧠 MITSDE - Task Notification
        </div>
        
        <!-- Body Section -->
        <div style="padding:20px;">
          <p>Dear <strong>${toName}</strong>,</p>
          <p>You have a new task added in your Todo system. Below are the details:</p>
          
          <!-- Task Details Table -->
          <table style="width:100%; border-collapse:collapse; margin:20px 0;">
            <tr>
              <td style="padding:8px; font-weight:bold; width:30%;">Title:</td>
              <td style="padding:8px;">${taskTitle}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold;">Description:</td>
              <td style="padding:8px;">${taskDesc || 'No description'}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold;">Deadline:</td>
              <td style="padding:8px; color:#dc3545; font-weight:bold;">${new Date(taskDeadline).toLocaleDateString()}</td>
            </tr>
          </table>
          
          <p>Please complete it before the deadline. ⏳</p>
        </div>
        
        <!-- Footer Section -->
        <div style="background:#f4f4f4; padding:15px; text-align:center; font-size:13px; color:#555;">
          This is an automated notification from your AI Task Manager. Do not reply.
        </div>
      </div>
    `;
    
    // Email options define karte hain
    const mailOptions = {
      from: `"MITSDE Todo System" <${process.env.EMAIL_FROM}>`, // Sender ka naam aur email
      to: toEmail, // Receiver ka email
      subject: `📝 New Task Added: ${taskTitle}`, // Email ka subject
      html: htmlContent, // HTML content
      // Optional: Plain text version bhi add kar sakte hain
      text: `Dear ${toName}, New task: ${taskTitle}. Deadline: ${taskDeadline}` // Plain text fallback
    };
    
    // Email bhejte hain
    const info = await transporter.sendMail(mailOptions); // transporter se mail send kiya
    console.log('✅ Task Email Sent:', info.messageId); // Success log
    return true; // Success return kiya
  } catch (error) {
    // Error handling
    console.error('❌ Task Email Error:', error.message); // Error log
    return false; // Failed return kiya
  }
};

// ============================================
// FUNCTION 2: REMINDER EMAIL BHEJNE KE LIYE
// ============================================
// Admin manual reminder bhej sakta hai ya cron job automatic bhejega
export const sendReminderEmail = async (toEmail, toName, taskTitle, taskDesc, taskDeadline) => {
  try {
    // Calculate days remaining until deadline
    const today = new Date(); // Aaj ki date
    const deadline = new Date(taskDeadline); // Task ki deadline
    const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)); // Days calculate kiye
    
    // Urgency message banate hain
    let urgencyMessage = '';
    if (daysRemaining < 0) {
      urgencyMessage = `<span style="color:#dc3545; font-weight:bold;">⚠️ OVERDUE by ${Math.abs(daysRemaining)} days!</span>`;
    } else if (daysRemaining === 0) {
      urgencyMessage = `<span style="color:#ffc107; font-weight:bold;">⏰ DUE TODAY!</span>`;
    } else if (daysRemaining <= 3) {
      urgencyMessage = `<span style="color:#ff9800; font-weight:bold;">🔔 Only ${daysRemaining} days left!</span>`;
    } else {
      urgencyMessage = `<span style="color:#28a745;">${daysRemaining} days remaining</span>`;
    }
    
    // Email ka HTML content
    const htmlContent = `
      <div style="max-width:600px; margin:auto; border:1px solid #eaeaea; border-radius:8px; font-family:sans-serif;">
        <!-- Header Section - Orange/Red for urgency -->
        <div style="background:#ff9e42; color:#fff; padding:20px; text-align:center; font-size:18px;">
          🔔 Task Reminder - Action Required!
        </div>
        
        <!-- Body Section -->
        <div style="padding:20px;">
          <p>Dear <strong>${toName}</strong>,</p>
          <p>This is a reminder to complete your pending task:</p>
          
          <!-- Task Details Table -->
          <table style="width:100%; border-collapse:collapse; margin:20px 0; border:2px solid #ff9e42;">
            <tr style="background:#fff8e6;">
              <td style="padding:12px; font-weight:bold; width:30%;">📌 Title:</td>
              <td style="padding:12px; font-size:16px; font-weight:bold;">${taskTitle}</td>
            </tr>
            <tr>
              <td style="padding:12px; font-weight:bold;">📝 Description:</td>
              <td style="padding:12px;">${taskDesc || 'No description'}</td>
            </tr>
            <tr style="background:#fff8e6;">
              <td style="padding:12px; font-weight:bold;">📅 Deadline:</td>
              <td style="padding:12px; color:#dc3545; font-weight:bold; font-size:16px;">${new Date(taskDeadline).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding:12px; font-weight:bold;">⏰ Status:</td>
              <td style="padding:12px; font-size:16px;">${urgencyMessage}</td>
            </tr>
          </table>
          
          <div style="background:#fff3cd; border-left:4px solid #ffc107; padding:15px; margin:20px 0;">
            <strong>⚠️ Important:</strong> Please complete this task as soon as possible to avoid delays.
          </div>
        </div>
        
        <!-- Footer Section -->
        <div style="background:#f4f4f4; padding:15px; text-align:center; font-size:13px; color:#555;">
          This is an automated reminder from the Admin via AI Task Manager. Do not reply.
        </div>
      </div>
    `;
    
    // Email options
    const mailOptions = {
      from: `"MITSDE Todo Reminder" <${process.env.EMAIL_FROM}>`, // Sender
      to: toEmail, // Receiver
      subject: `⏰🔔 Reminder: Complete Task - ${taskTitle}`, // Subject with urgency
      html: htmlContent, // HTML content
      text: `Reminder: ${taskTitle}. Deadline: ${taskDeadline}. Please complete soon!` // Plain text
    };
    
    // Email bhejte hain
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Reminder Email Sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Reminder Email Error:', error.message);
    return false;
  }
};

// ============================================
// FUNCTION 3: TEST EMAIL BHEJNE KE LIYE (Optional)
// ============================================
// Configuration test karne ke liye - ek test email bhej sakte hain
export const sendTestEmail = async () => {
  try {
    const mailOptions = {
      from: `"MITSDE Test" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_FROM, // Khud ko test email bhej rahe hain
      subject: '✅ Test Email - SMTP Configuration Working',
      html: '<h2>Success! ✅</h2><p>Your email configuration is working perfectly.</p>',
      text: 'Test email successful!'
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test Email Sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Test Email Failed:', error.message);
    return false;
  }
};

// ============================================
// TRANSPORTER VERIFICATION (Optional - startup pe check kar sakte hain)
// ============================================
// Ye function check karega ki SMTP connection sahi hai ya nahi
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify(); // Connection verify kiya
    console.log('✅ Email Server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email Server Connection Error:', error.message);
    return false;
  }
};