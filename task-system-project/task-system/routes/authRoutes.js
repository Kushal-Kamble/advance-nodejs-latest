// routes/authRoutes.js
// ------------------------------------------
// Auth se related saare routes yaha handle honge
// ------------------------------------------

import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// -----------------------------
// GET Routes (Pages Rendering)
// -----------------------------

// Login Page
router.get("/login", authController.showLogin);

// Register Page
router.get("/register", authController.showRegister);

// Logout
router.get("/logout", authController.logout);


// -----------------------------
// POST Routes (Form Actions)
// -----------------------------

// Register User
router.post("/register", authController.registerUser);

// Login User
router.post("/login", authController.loginUser);

export default router;
