// ============================================
// models/User.js - User ka database schema

import mongoose from 'mongoose'; // mongoose import kiya MongoDB schemas banane ke liye
import bcrypt from 'bcryptjs'; // bcryptjs import kiya password hash karne ke liye

// User schema define karte hain - Ye batata hai ki user document me kya kya fields honge
const userSchema = new mongoose.Schema({
  // name field - User ka naam store hoga
  name: {
    type: String, // Data type string hai
    required: [true, 'Name is required'], // Ye field required hai, agar nahi diya to error ayega
    trim: true // Extra spaces automatically remove ho jayengi
  },
  
  // email field - User ki email store hogi
  email: {
    type: String, // Data type string hai
    required: [true, 'Email is required'], // Email required hai
    unique: true, // Email unique honi chahiye, duplicate nahi ho sakti
    lowercase: true, // Email automatically lowercase me convert ho jayegi
    trim: true, // Extra spaces remove ho jayengi
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] // Email validation regex se
  },
  
  // password field - User ka hashed password store hoga
  password: {
    type: String, // Data type string hai
    required: [true, 'Password is required'], // Password required hai
    minlength: [6, 'Password must be at least 6 characters'] // Minimum 6 characters chahiye
  },
  
  // role field - User ka role (admin ya user)
  role: {
    type: String, // Data type string hai
    enum: ['user', 'admin'], // Sirf ye 2 values allowed hain
    default: 'user' // Default role 'user' hoga agar specify nahi kiya
  }
}, {
  timestamps: true // Automatically createdAt aur updatedAt fields add ho jayengi
});

// Pre-save middleware - Ye password save hone se pehle automatically hash kar dega
userSchema.pre('save', async function(next) {
  // Agar password modify nahi hua to hash karne ki zarurat nahi
  if (!this.isModified('password')) {
    return next(); // Aage badh jao
  }
  
  // Password ko hash karte hain bcrypt se
  const salt = await bcrypt.genSalt(10); // Salt generate kiya (10 rounds)
  this.password = await bcrypt.hash(this.password, salt); // Password hash ho gaya
  next(); // Aage badho
});

// Method to compare password - Login ke time password match karne ke liye
userSchema.methods.comparePassword = async function(enteredPassword) {
  // bcrypt.compare() entered password ko stored hash se compare karega
  return await bcrypt.compare(enteredPassword, this.password); // true ya false return karega
};

// User model create karte hain schema se
const User = mongoose.model('User', userSchema); // 'User' collection name hai database me

// Model ko export karte hain taaki dusri files me use kar sakein
export default User;