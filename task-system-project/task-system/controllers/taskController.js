// controllers/taskController.js — Task CRUD + stats
import Task from '../models/Task.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Helper: create transporter for nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// GET /dashboard
export const dashboard = async (req, res) => {
  const userId = req.session.user.id;
  const tasks = await Task.find({ user: userId }).sort({ deadline: 1 }).lean();

  const total = tasks.length;
  const pending = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;

  res.render('dashboard', { user: req.session.user, tasks, total, pending, completed });
};

// API: GET /tasks/list
export const list = async (req, res) => {
  const userId = req.session.user.id;
  const tasks = await Task.find({ user: userId }).sort({ deadline: 1 }).lean();
  res.json(tasks);
};

// API: POST /tasks/save
export const save = async (req, res) => {
  const { task_id, title, description, start_date, deadline, priority } = req.body;
  const userId = req.session.user.id;

  if (task_id) {
    // update
    await Task.findByIdAndUpdate(task_id, { title, description, start_date, deadline, priority });
    return res.json({ status: 'updated' });
  }

  // create
  const task = new Task({ user: userId, title, description, start_date, deadline, priority });
  await task.save();

  // send email notification (async, silent fail)
  try {
    const user = await User.findById(userId);
    const mail = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `📝 New Task Added: ${title}`,
      html: `<p>Hi ${user.name},</p><p>A new task "${title}" has been added. Deadline: ${deadline}</p>`
    };
    transporter.sendMail(mail).catch(err => console.error('Mail error', err.message));
  } catch (e) {
    console.error('Mail send failed', e.message);
  }

  res.json({ status: 'created' });
};

// API: POST /tasks/delete
export const remove = async (req, res) => {
  const { id } = req.body;
  await Task.findByIdAndDelete(id);
  res.json({ status: 'deleted' });
};

// API: POST /tasks/complete
export const complete = async (req, res) => {
  const { id } = req.body;
  await Task.findByIdAndUpdate(id, { completed: true });
  res.json({ status: 'completed' });
};

// POST /tasks/send-reminder
export const sendReminder = async (req, res) => {
  const { id } = req.body;
  const task = await Task.findById(id).populate('user').lean();
  if (!task) return res.json({ status: 'invalid' });

  const mail = {
    from: process.env.EMAIL_FROM,
    to: task.user.email,
    subject: `⏰ Reminder: ${task.title}`,
    html: `<p>Hi ${task.user.name},</p><p>Reminder to complete task: <strong>${task.title}</strong><br>Deadline: ${task.deadline}</p>`
  };

  try {
    await transporter.sendMail(mail);
    await Task.findByIdAndUpdate(id, { last_reminder_sent: new Date() });
    res.json({ status: 'sent' });
  } catch (err) {
    console.error('Reminder error', err.message);
    res.json({ status: 'fail' });
  }
};