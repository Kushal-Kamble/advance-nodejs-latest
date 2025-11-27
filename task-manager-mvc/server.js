// server.js - App entry
require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static public folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// View engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes - API

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Admin stats endpoint (for Charts)
app.use('/api/admin', require('./routes/adminRoutes'));

// Simple pages (login/register + dashboards)
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));

// manager & employee views
app.get('/manager/dashboard', (req, res) => res.render('manager/dashboard'));
app.get('/manager/create-task', (req, res) => res.render('manager/createTask'));
app.get('/employee/dashboard', (req, res) => res.render('employee/dashboard'));
app.get('/admin/dashboard', (req, res) => res.render('admin/dashboard'));

// Start cron (reminders)
require('./cron/reminders');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
