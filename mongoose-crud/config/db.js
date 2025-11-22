// config/db.js
// ---------------------------------------
// यह फाइल MongoDB से कनेक्शन बनाने का काम करती है
// ---------------------------------------

const mongoose = require("mongoose");

const connectDB = async (uri) => {
    try {
        // MongoDB से connect करना
        await mongoose.connect(uri);
        console.log("✅ MongoDB Succefully Connected to:", uri);
    } catch (error) {
        console.log("❌ MongoDB से कनेक्ट करने में Error:", error.message);
        process.exit(1); // सर्वर बंद कर देना (important)
    }
};

module.exports = connectDB;
