// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ---------------- REGISTER (employee) ----------------
export const register = async (req, res) => {
  try {
    // body से data लेना
    const { firstName, lastName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email पहले से मौजूद है" });

    const user = await User.create({ firstName, lastName, email, password, role: "employee" });
    return res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // JWT generate
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "7d" });

    res.json({ token, user: { id: user._id, firstName: user.firstName, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- CREATE ADMIN (seed) ----------------
// ये route केवल initial setup के लिए; production में इसे restrict कर दें
export const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const admin = await User.create({ firstName, lastName, email, password, role: "admin" });
    res.json({ message: "Admin created", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
