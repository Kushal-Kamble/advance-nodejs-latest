const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Admin creates manager
exports.createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Manager already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const manager = new User({
      name,
      email,
      password: hashed,
      role: "manager",
      managerOf: []
    });

    await manager.save();

    res.json({ message: "Manager created", manager });
  } catch (err) {
    console.error("Create manager error", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Manager creates employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Employee already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const employee = new User({
      name,
      email,
      password: hashed,
      role: "employee",
      manager: req.user.id   // logged in manager
    });

    await employee.save();

    // Add employee to manager.managerOf
    const manager = await User.findById(req.user.id);
    manager.managerOf.push(employee._id);
    await manager.save();

    res.json({ message: "Employee created", employee });
  } catch (err) {
    console.error("Create employee error", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Manager: get my employees
exports.getMyEmployees = async (req, res) => {
  try {
    const employees = await User.find({ manager: req.user.id })
      .select("name email role");

    res.json({ employees });
  } catch (err) {
    console.error("Get employees error", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = router;
