// ===============================================
// index.js
// ===============================================
// Ye Node.js app email bhejne ke liye banaya gaya hai
// Ye Nodemailer + EJS templates + .env config ka use karta hai
// ===============================================

// -------------------------
// 1️⃣ Required Modules
// -------------------------
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
require('dotenv').config(); // .env file ko load karta hai
const port = 5000;

// -------------------------
// 2️⃣ Middlewares
// -------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // view engine set for EJS templates

// -------------------------
// 3️⃣ SMTP Configuration (from .env file)
// -------------------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // port 587 ke liye false rakho (TLS auto hota hai)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// ================================
// 4️⃣ Single Email Route
// ================================
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body; // form se data le raha hai

  try {
    // Step 1️⃣: EJS email template padho
    const templatePath = path.join(__dirname, 'views', 'email-template.ejs');
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Step 2️⃣: Template me dynamic values inject karo
    const html = ejs.render(template, {
      name: 'Kushal Kamble', // yahan tum dynamic name bhi use kar sakte ho
      subject: subject,
      message: text
    });

    // Step 3️⃣: Mail send karo
    const info = await transporter.sendMail({
      from: '"WorkSmart" <kushal.kamble@mitsde.com>', // ✅ verified email in AWS SES
      to: to, // single recipient
      subject: subject,
      html: html, // beautiful HTML template
      attachments: [
        {
          filename: 'data.pdf',
          path: path.join(__dirname, 'files', 'data.pdf')
        }
      ]
    });

    // Step 4️⃣: Success Response
    res.json({ message: '✅ Email sent successfully', info });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
});

// ================================
// 5️⃣ Render Mail Form Page (Default Page)
// ================================
app.get('/', (req, res) => {
  res.render('mailpage'); // Single email form
});

// ================================
// 6️⃣ Render Multi Email Form Page
// ================================
app.get('/multi-email', (req, res) => {
  res.render('multimailpage'); // Multiple email form page
});

// ================================
// 7️⃣ Multi Email Send Route (BCC)
// ================================
app.post('/send-multi-email', async (req, res) => {
  const { bcc, subject, text } = req.body;

  try {
    // Step 1️⃣: BCC email list ko array me convert karo
    const bccList = bcc
      .split(',')
      .map(email => email.trim())
      .filter(email => email !== '');

    if (bccList.length === 0) {
      return res.status(400).json({ message: '⚠️ No valid BCC emails provided.' });
    }

    // Step 2️⃣: Multiemail EJS template render karo
    const templatePath = path.join(__dirname, 'views', 'multiemail-template.ejs');
    const template = fs.readFileSync(templatePath, 'utf-8');
    const html = ejs.render(template, {
      subject: subject,
      message: text
    });

    // Step 3️⃣: Send mail using BCC
    const info = await transporter.sendMail({
      from: '"WorkSmart" <kushal.kamble@mitsde.com>', // ✅ verified email
      to: '', // blank since we’re using BCC
      bcc: bccList, // multiple recipients here
      subject: subject,
      html: html,
      attachments: [
        {
          filename: 'data.pdf',
          path: path.join(__dirname, 'files', 'data.pdf')
        }
      ]
    });

    // Step 4️⃣: Response to browser
    res.json({
      message: `✅ Email successfully sent to ${bccList.length} recipients.`,
      bccList,
      info
    });
  } catch (error) {
    console.error('❌ Error sending multi email:', error);
    res.status(500).json({ message: 'Failed to send bulk email', error });
  }
});

// ================================
// 8️⃣ Start Express Server
// ================================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
