// routes/authRoutes.js - Authentication related routes

import express from 'express'; // Express framework import kiya
const router = express.Router(); // Router instance banaya - ye routes handle karega

// Middleware import karte hain
import auth from '../middleware/auth.js'; // auth middleware import kiya - check karega user logged in hai ya nahi

// Controller functions import karte hain
import * as authController from '../controllers/authController.js'; // sabhi auth controller functions import kiye

// ============================================
// LOGIN ROUTES
// ============================================

// GET /login - Login page dikhane ke liye
router.get('/login', authController.loginPage); 
// Jab user /login pe jayega to loginPage function call hoga controller se

// POST /login - Login form submit karne ke liye
router.post('/login', authController.login);
// Jab user login form submit karega to login function call hoga
// Ye email aur password verify karega aur JWT token generate karega

// ============================================
// REGISTER ROUTES
// ============================================

// GET /register - Register page dikhane ke liye
router.get('/register', authController.registerPage);
// Jab user /register pe jayega to registerPage function call hoga

// POST /register - Registration form submit karne ke liye
router.post('/register', authController.register);
// Jab user registration form submit karega to register function call hoga
// Ye naya user database me create karega

// ============================================
// LOGOUT ROUTE
// ============================================

// GET /logout - User logout karne ke liye
router.get('/logout', auth, authController.logout);
// auth middleware pehle chalega - check karega user logged in hai
// Phir logout function call hoga jo token clear kar dega

// ============================================
// DASHBOARD ROUTE
// ============================================

// GET /dashboard - User dashboard dikhane ke liye
router.get('/dashboard', auth, authController.dashboard);
// auth middleware pehle chalega - user logged in hona chahiye
// Phir dashboard function call hoga jo dashboard page render karega

// ============================================
// Router ko export karte hain taaki server.js me use kar sakein
export default router;
















