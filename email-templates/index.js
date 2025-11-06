// index.js
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs'); // <-- ensure ejs is required
const fs = require('fs');   // <-- for reading file
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// =======================
// 1️⃣ SMTP Transport Setup
// =======================
const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: 'AKIA5OQ6466FZWEYNNVJ',
    pass: 'BB8uQenn6fCEjW791mFxeUgQ39xwI/9PEBDPz7uasG58'
  }
});

// =======================
// 2️⃣ Route to send Email
// =======================
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    // Step 1: Read email-template.ejs file
    const templatePath = path.join(__dirname, 'views', 'email-template.ejs');
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Step 2: Render EJS template into HTML
    const html = ejs.render(template, {
      name: 'Kushal Kamble', // static ya DB se laa sakte ho
      subject: subject,
      message: text
    });

    // Step 3: Send Email
    const info = await transporter.sendMail({
      from: '"Kushal Kamble" <kushal.kamble@mitsde.com>',
      to: to,
      subject: subject,
      html: html, // <-- EJS rendered HTML yahan jaayega
      attachments: [
        {
          filename: 'data.pdf',
          path: path.join(__dirname, 'files', 'data.pdf')
        }
      ]
    });

    res.json({ message: '✅ Email sent successfully', info });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
});

// =======================
// 3️⃣ Render Mail Form Page
// =======================
app.get('/', (req, res) => {
  res.render('mailpage');
});

// =======================

// =======================
// 🆕  Route to Render Multi Email Page
// =======================
app.get('/multi-email', (req, res) => {
  res.render('multimailpage'); // renders the new form
});

// =======================
// 🆕  Route to Send Multiple Emails via BCC
// =======================
app.post('/send-multi-email', async (req, res) => {
  const { bcc, subject, text } = req.body;

  try {
    // Convert comma-separated emails into array & trim spaces
    const bccList = bcc.split(',').map(email => email.trim()).filter(email => email !== '');

    if (bccList.length === 0) {
      return res.status(400).json({ message: 'No valid BCC emails provided.' });
    }

    const info = await transporter.sendMail({
      from: '"Kushal Kamble" <kushal.kamble@mitsde.com>',
      to: '', // you can leave 'to' blank if only BCC is used
      bcc: bccList, // multiple recipients here
      subject: subject,
      html: `<h3>${subject}</h3><p>${text}</p>`,
      attachments: [
        {
          filename: 'data.pdf',
          path: path.join(__dirname, 'files', 'data.pdf')
        }
      ]
    });

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

// 4️⃣ Start Server
// =======================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
