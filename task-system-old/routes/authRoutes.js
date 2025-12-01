// routes/authRoutes.js
import express from "express";
import { register, login, createAdmin } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", register);      // employee register
router.post("/login", login);            // login (returns JWT)
router.post("/create-admin", createAdmin); // initial admin seed (restricted later)

export default router;
