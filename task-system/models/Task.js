// models/Task.js - Task ka database schema

import mongoose from 'mongoose'; // mongoose import kiya MongoDB schemas banane ke liye

// Task schema define karte hain - Ye batata hai ki task document me kya kya fields honge
const taskSchema = new mongoose.Schema({
  // user_id field - Kis user ka task hai uska reference
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId type hai (MongoDB ka special ID)
    ref: 'User', // Ye User model ko reference karta hai
    required: [true, 'User ID is required'] // User ID required hai
  },
  
  // title field - Task ka title/naam
  title: {
    type: String, // Data type string hai
    required: [true, 'Title is required'], // Title required hai
    trim: true, // Extra spaces remove ho jayengi
    maxlength: [255, 'Title cannot exceed 255 characters'] // Maximum 255 characters allowed
  },
  
  // description field - Task ki detail/description
  description: {
    type: String, // Data type string hai
    trim: true, // Extra spaces remove ho jayengi
    default: '' // Agar description nahi di to empty string hogi
  },
  
  // start_date field - Task kab start hona hai
  start_date: {
    type: Date, // Data type Date hai
    required: [true, 'Start date is required'] // Start date required hai
  },
  
  // deadline field - Task ki last date
  deadline: {
    type: Date, // Data type Date hai
    required: [true, 'Deadline is required'] // Deadline required hai
  },
  
  // priority field - Task ki priority (Low, Medium, High)
  priority: {
    type: String, // Data type string hai
    enum: ['Low', 'Medium', 'High'], // Sirf ye 3 values allowed hain
    default: 'Medium' // Default priority 'Medium' hogi
  },
  
  // completed field - Task complete hui ya nahi
  completed: {
    type: Boolean, // Data type boolean hai (true/false)
    default: false // Default value false hai (pending)
  },
  
  // last_reminder_sent field - Last reminder kab send hui thi
  last_reminder_sent: {
    type: Date, // Data type Date hai
    default: null // Default value null hai (koi reminder nahi bheji abhi tak)
  }
}, {
  timestamps: true // Automatically createdAt aur updatedAt fields add ho jayengi
});

// Index create karte hain fast queries ke liye
taskSchema.index({ user_id: 1, deadline: 1 }); // user_id aur deadline pe composite index
taskSchema.index({ completed: 1 }); // completed field pe index

// Virtual field - Task overdue hai ya nahi check karne ke liye
taskSchema.virtual('isOverdue').get(function() {
  // Agar task complete nahi hai aur deadline nikal gayi hai to true return karega
  return !this.completed && this.deadline < new Date();
});

// Task model create karte hain schema se
const Task = mongoose.model('Task', taskSchema); // 'Task' collection name hai database me

// Model ko export karte hain taaki dusri files me use kar sakein
export default Task;



