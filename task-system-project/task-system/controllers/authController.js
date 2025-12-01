// controllers/authController.js — Authentication logic
import User from '../models/User.js';

// GET / -> redirect to login if not logged in
export const index = (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  return res.redirect('/login');
};

// GET /login
export const loginPage = (req, res) => {
  res.render('login', { message: null });
};

// POST /login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.render('login', { message: 'Invalid email or password' });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.render('login', { message: 'Invalid email or password' });

  // set session
  req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
  if (user.role === 'admin') return res.redirect('/admin/dashboard');
  res.redirect('/dashboard');
};

// GET /register
export const registerPage = (req, res) => {
  res.render('register', { message: null });
};

// POST /register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.render('register', { message: 'Email already exists' });

  const user = new User({ name, email, password });
  await user.save();
  res.redirect('/login?success=1');
};

// GET /logout
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};