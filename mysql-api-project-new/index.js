const express = require("express");
const app = express();
require("dotenv").config(); // .env file se PORT aur DB credentials load karne ke liye
const db = require("./config/db"); // MySQL connection pool import

// Middleware
app.use(express.urlencoded({ extended: true })); // Form data ko parse karne ke liye
app.use(express.json()); // JSON data ko parse karne ke liye

// Public folder
app.use(express.static("public")); // 'public' folder me static files serve karne ke liye

// Routes import
const contactRoutes = require("./routes/contactRoutes");
app.use("/contactsnew", contactRoutes); // "/contactsnew" prefix ke saath contact routes

// Home route
app.get("/", (req, res) => {
    res.send("MySQL CRUD API is Running Successfully 👍");
});

// Test MySQL Connection
(async () => {
    try {
        await db.query("SELECT 1"); // simple test query
        console.log("✅ MySQL Connected Successfully! Kushal");
    } catch (err) {
        console.error("❌ MySQL Connection Failed:", err.message);
    }
})();

// Start server
app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});


/*


✅ Quick Route → Function Mapping
HTTP Method	Route	Controller Function	Action
GET	/contactsnew	getContacts	Saare contacts read karna
POST	/contactsnew	createContact	Naya contact add karna
PUT	/contactsnew/:id	updateContact	Contact update karna
DELETE	/contactsnew/:id	deleteContact	Contact delete karna


*/
