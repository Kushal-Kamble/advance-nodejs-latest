// models/userModel.js
const mongoose = require("mongoose");

// Simple User Schema
// User ka structure (schema) define kar rahe hain

const userSchema = new mongoose.Schema({
    name: String,  // User ka name
    email: String,  // User ka email
    password: String // Hashed password (encrypt hoga)
});

// Model export kar diya taaki controller me use kar sake


module.exports = mongoose.model("User", userSchema);
