// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

// Register User
// Register API

router.post("/register", userCtrl.registerUser);

// Login User (Token Generate)
// Login API (Token return karta hai)

router.post("/login", userCtrl.loginUser);

// Protected Route
// Protected route (token chahiye)

router.get("/profile", auth, userCtrl.getProfile);

module.exports = router;
