// models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
});

// optional: createdAt index for sorting
MessageSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Message", MessageSchema);
