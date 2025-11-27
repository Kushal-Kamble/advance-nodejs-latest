const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin','manager','user'], default: 'user' },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // agar employee hai to uska manager
  managerOf: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // agar manager hai to uske employees
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
