require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcrypt');

(async ()=>{
  await connectDB();
  const existing = await User.findOne({ email: 'admin@tms.com' });
  if (existing) { console.log('Admin exists'); process.exit(0); }
  const hashed = await bcrypt.hash('Admin@123', 10);
  const admin = new User({ name: 'Admin', email: 'admin@tms.com', password: hashed, role: 'admin' });
  await admin.save();
  console.log('Admin created: admin@tms.com / Admin@123');
  process.exit(0);
})();
