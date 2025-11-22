// models/Restaurant.js
// ---------------------------------------------------------
// यह Restaurant का Schema है (structure तय करता है)
// ---------------------------------------------------------

const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "रेस्टोरेंट का नाम जरूरी है"],
        trim: true
    },
    address: {
        type: String,
        default: "अज्ञात"
    },
    cuisine: {
        type: String,
        default: "General"
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Model Export
module.exports = mongoose.model("Restaurant", RestaurantSchema);
