// config/db.js
// MongoDB se connect hone ke liye mongoose import

const mongoose = require("mongoose");

// .env variables load

require("dotenv").config();

// Database connect function
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

module.exports = mongoose;
