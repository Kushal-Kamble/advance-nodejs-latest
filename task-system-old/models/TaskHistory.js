// models/TaskHistory.js
import mongoose from "mongoose";

const TaskHistorySchema = new mongoose.Schema({
  taskId:   { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  action:   { type: String }, // e.g., "Assigned", "Claimed", "Completed"
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note:     { type: String },
  createdAt:{ type: Date, default: Date.now }
});

export default mongoose.model("TaskHistory", TaskHistorySchema);
