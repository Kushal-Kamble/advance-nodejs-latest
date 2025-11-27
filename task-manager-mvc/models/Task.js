const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  file: { type: String }, // filename saved in public/uploads
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open','assigned','claimed','in_progress','completed','closed'], default: 'assigned' },
  deadline: { type: Date },
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
  claimedAt: { type: Date },
  completedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
