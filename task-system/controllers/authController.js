// ============================================
// controllers/authController.js - Authentication related functions

import User from '../models/User.js'; // User model import kiya
import jwt from 'jsonwebtoken'; // JWT token generate karne ke liye

// ============================================
// LOGIN PAGE SHOW KARNE KE LIYE
// ============================================
export const loginPage = (req, res) => {
  // Agar user already logged in hai to dashboard pe redirect karo
  if (req.cookies.token) {
    return res.redirect('/dashboard'); // Dashboard pe bhej diya
  }
  // Warna login page render karo
  res.render('login', { error: null, success: null }); // login.ejs file render hogi
};

// ============================================
// REGISTER PAGE SHOW KARNE KE LIYE
// ============================================
export const registerPage = (req, res) => {
  // Agar user already logged in hai to dashboard pe redirect karo
  if (req.cookies.token) {
    return res.redirect('/dashboard'); // Dashboard pe bhej diya
  }
  // Warna register page render karo
  res.render('register', { error: null, success: null }); // register.ejs file render hogi
};

// ============================================
// USER REGISTRATION HANDLE KARNE KE LIYE
// ============================================
export const register = async (req, res) => {
  try {
    // Request body se data extract karte hain
    const { name, email, password } = req.body; // Destructuring se name, email, password nikale

    // Check karte hain ki email already exist to nahi karti
    const existingUser = await User.findOne({ email }); // Database me email search kiya
    if (existingUser) {
      // Agar user mil gaya to error ke saath register page render karo
      return res.render('register', { 
        error: 'Email already exists', // Error message
        success: null 
      });
    }

    // Naya user create karte hain
    const user = await User.create({
      name, // User ka naam
      email, // User ki email
      password, // Password (automatic hash ho jayega model me)
      role: 'user' // Default role user hai
    });

    // Success message ke saath login page pe redirect
    res.redirect('/login?success=1'); // Success parameter query me pass kiya
  } catch (error) {
    // Agar koi error aaye to console me print karo aur error page render karo
    console.error('Registration Error:', error); // Error console me
    res.render('register', { 
      error: 'Registration failed. Please try again.', // Error message
      success: null 
    });
  }
};

// ============================================
// USER LOGIN HANDLE KARNE KE LIYE
// ============================================
export const login = async (req, res) => {
  try {
    // Request body se email aur password extract karte hain
    const { email, password } = req.body; // Destructuring se data nikala

    // Email se user ko database me dhundhte hain
    const user = await User.findOne({ email }); // Email se user search kiya
    
    // Agar user nahi mila ya password match nahi hua
    if (!user || !(await user.comparePassword(password))) {
      // Error ke saath login page render karo
      return res.render('login', { 
        error: 'Invalid email or password', // Error message
        success: null 
      });
    }

    // JWT token generate karte hain
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Token me user ID aur role store kiya
      process.env.JWT_SECRET, // Secret key .env se liya
      { expiresIn: '7d' } // Token 7 din tak valid rahega
    );

    // Token ko cookie me store karte hain
    res.cookie('token', token, {
      httpOnly: true, // JavaScript se access nahi ho sakta (security ke liye)
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    // User ke role ke according redirect karte hain
    if (user.role === 'admin') {
      res.redirect('/admin/dashboard?login=1'); // Admin dashboard pe
    } else {
      res.redirect('/dashboard?login=1&user=' + encodeURIComponent(user.name)); // User dashboard pe
    }
  } catch (error) {
    // Agar error aaye to console me print karo aur error page render karo
    console.error('Login Error:', error); // Error console me
    res.render('login', { 
      error: 'Login failed. Please try again.', // Error message
      success: null 
    });
  }
};

// ============================================
// USER LOGOUT HANDLE KARNE KE LIYE
// ============================================
export const logout = (req, res) => {
  // Cookie clear karte hain (token delete ho jayega)
  res.clearCookie('token'); // Token cookie remove ho gayi
  // Login page pe redirect karte hain
  res.redirect('/login'); // Login page pe bhej diya
};

// ============================================
// DASHBOARD PAGE SHOW KARNE KE LIYE
// ============================================
export const dashboard = async (req, res) => {
  try {
    // Middleware se user data mil jayega req.user me
    const user = req.user; // User object middleware se aaya
    
    // Dashboard page render karte hain user data ke saath
    res.render('dashboard', { user }); // dashboard.ejs render hoga
  } catch (error) {
    // Error handling
    console.error('Dashboard Error:', error); // Error console me
    res.redirect('/login'); // Error pe login page pe bhej do
  }
};
