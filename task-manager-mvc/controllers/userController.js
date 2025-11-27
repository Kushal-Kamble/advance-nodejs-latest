const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register (basic) - Note: Admin/Manager creation usually via admin or seed
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, manager } = req.body;
    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: role || 'user', manager: manager || null });
    await user.save();

    // if employee has manager, add to manager.managerOf
    if (manager) {
      const mgr = await User.findById(manager);
      if (mgr) { mgr.managerOf.push(user._id); await mgr.save(); }
    }

    res.json({ message: 'User registered' });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login => returns token + role + name
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
