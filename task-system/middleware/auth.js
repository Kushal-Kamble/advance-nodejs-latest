// ============================================
// middleware/auth.js - User authentication check karne ke liye

import jwt from 'jsonwebtoken'; // JWT token verify karne ke liye import kiya
import User from '../models/User.js'; // User model import kiya

// ============================================
// AUTH MIDDLEWARE - Ye check karega ki user logged in hai ya nahi
// ============================================
const auth = async (req, res, next) => {
  try {
    // Step 1: Cookie se token extract karte hain
    const token = req.cookies.token; // 'token' naam ki cookie se JWT token nikala
    
    // Step 2: Agar token nahi mila to login page pe redirect
    if (!token) {
      return res.redirect('/login'); // Token nahi hai to login karwao
    }
    
    // Step 3: Token verify karte hain JWT secret key se
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token decode kiya
    // decoded me { id, role } milega jo token me store tha
    
    // Step 4: Token se user ID extract karke database se user fetch karte hain
    const user = await User.findById(decoded.id).select('-password'); // Password field exclude kiya
    
    // Step 5: Agar user nahi mila to token invalid hai
    if (!user) {
      res.clearCookie('token'); // Invalid token ko clear kar diya
      return res.redirect('/login'); // Login page pe bhej diya
    }
    
    // Step 6: User object ko request me attach kar dete hain
    // Ab aage ke functions me req.user se user data mil jayega
    req.user = user; // User data request object me store ho gaya
    
    // Step 7: Next function call karte hain (aage badho)
    next(); // Middleware successfully pass ho gaya
  } catch (error) {
    // Error handling - Agar token verify fail ho gaya
    console.error('Auth Middleware Error:', error.message); // Error console me
    res.clearCookie('token'); // Token clear kar diya
    res.redirect('/login'); // Login page pe redirect
  }
};

// Middleware ko export karte hain
export default auth;