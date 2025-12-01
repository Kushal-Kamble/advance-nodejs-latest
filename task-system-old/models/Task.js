// models/Task.js
import mongoose from "mongoose";

const AttachmentSchema = new mongoose.Schema({
  filename: String,
  path: String,
  uploadedAt: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  assignedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // manager who assigned
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // employee
  status:      { type: String, enum: ["assigned","claimed","completed","closed","rejected"], default: "assigned" },
  dueDate:     { type: Date },
  attachments: [AttachmentSchema]
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);
