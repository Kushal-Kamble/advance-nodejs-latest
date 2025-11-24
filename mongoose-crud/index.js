// index.js
// -----------------------------------------------------------
// यह पूरी एप्लिकेशन का entry point है (server start यहीं से)
// -----------------------------------------------------------

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// JSON body parser
app.use(express.json());

// MongoDB से connect (local)
connectDB(process.env.MONGO_URI);

// Routes import
const restaurantRoutes = require("./routes/restaurantRoutes");

// Base API Route
app.use("/api/restaurants", restaurantRoutes);

// Default Route
app.get("/", (req, res) => {
    res.send("Node + MongoDB MVC API Running Kushal...");
});

// Server start
const PORT = process.env.PORT || 5000;

// process .env file me jo variable hai use hum process.env.PORT se access krte hai 

app.listen(PORT, () => {
    console.log(`🚀 Server start on  this  PORT: ${PORT}`);
});
