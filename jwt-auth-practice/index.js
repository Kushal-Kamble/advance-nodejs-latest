// index.js

// Express import kar rahe hain (server banane ke liye)

const express = require("express");
const app = express();
// .env file se variables load karne ke liye

require("dotenv").config();

// MongoDB connection import

const db = require("./config/db");

// Body data read karne ke liye
// JSON body ko read karne ke liye middleware

app.use(express.json());
// User routes import


// Routes import
const userRoutes = require("./routes/userRoutes");

// Sabhi user APIs /api/user se start hongi

app.use("/api/user", userRoutes);

// Server start
// Server ko start kar rahe hain

app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});
