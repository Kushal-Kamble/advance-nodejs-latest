// config/db.js - Database connection file

import mongoose from 'mongoose'; // mongoose naam ka variable banaya MongoDB ke saath kaam karne ke liye

// connectDB naam ka async function banaya jo database se connect karega
const connectDB = async () => {
  try {
    // MongoDB se connection establish karte hain
    await mongoose.connect(process.env.MONGO_URI); // .env file se MONGO_URI use kiya
    console.log('✅ MongoDB Connected Successfully'); // Success message console me print hoga
  } catch (error) {
    // Agar error aaye to console me print karenge aur process exit kar denge
    console.error('❌ MongoDB Connection Error:', error.message); // Error message
    process.exit(1); // Process ko exit kar diya error code 1 ke saath
  }
};

// Function ko export kiya taaki dusri files me use kar sakein
export default connectDB;