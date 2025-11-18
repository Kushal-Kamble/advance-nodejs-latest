const express = require("express");
const sequelize = require("./config/db");  // DB connection
const User = require("./models/User");     // Model

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.urlencoded({ extended: true })); // Form data ko parse karne ke liye

// Middleware (JSON body parse करने के लिए)
app.use(express.json());

// Routes
// /api/users  routes ka naam hai 
app.use("/api/users", userRoutes);

// Sequelize Sync (टेबल अपने आप बन जाएगा)
sequelize.sync()
    .then(() => {
        console.log("Database Tables Synced Successfully...");
    })
    .catch(err => {
        console.log("Error in Sync:", err);
    });

// Server Start
app.listen(5000, () => {
    console.log("Server Running at http://localhost:5000");
});
