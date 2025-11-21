require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const logger = require("./utils/logger");

app.use(express.json());

// Default route
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// Users API routes
app.use("/api/users", userRoutes);

// Server + Database start
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
};

start();
