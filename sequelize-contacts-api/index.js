const express = require("express");
const dotenv = require("dotenv");
dotenv.config();


const sequelize = require("./config/db"); // DB connection
const contactRoutes = require("./routes/contactRoutes");


const app = express();


// x-www-form-urlencoded के लिए middleware (forms से आता है)
app.use(express.urlencoded({ extended: true }));


// JSON body parse के लिए (अगर JSON भेजो तो भी चलेगा)
app.use(express.json());


// Routes
app.use("/api/contacts", contactRoutes);


// Sequelize Sync
sequelize.sync()
.then(() => console.log("Database Tables Synced Successfully..."))
.catch(err => console.log("Error in Sync:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running at http://localhost:${PORT}`));