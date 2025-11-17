// Step 1: Express include
const express = require("express");
const app = express();

// Step 2: MySQL2 include
const mysql = require("mysql2");

// Step 3: Middleware (form-data + JSON accept)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Step 4: Create MySQL Connection
// const db = mysql.createConnection({
//     host: "localhost:3309",  // XAMPP में default port 3306 की जगह 3309 होता है
//     user: "root",
//     password: "",   // XAMPP में password blank होता है
//     database: "contacts"  // Updated Database Name
// });

const db = mysql.createConnection({
    host: "localhost",
    port: 3309,   // पोर्ट अलग से
    user: "root",
    password: "",
    database: "contacts_db_nodejs"  // Updated Database Name
});


// Check MySQL Connection
db.connect((err) => {
    if (err) {
        console.log("MySQL Connection Failed:", err);
    } else {
        console.log("MySQL Connected Successfully! Kushal");
    }
});

// ----------------------------------------
// CRUD API ROUTES
// ----------------------------------------

// READ All Data API
//GET Method get mens data ko read krna hai
// GET Method se hum data ko fetch karte hai
// GET Method se  humne data fetch karna hai matlab data ko read kiya hai
app.get("/contacts", (req, res) => {
    let sql = "SELECT * FROM contacts"; // yha database ka sara data aayega

    db.query(sql, (err, rows) => { // rows mein sara data aayega
        if (err) {
            return res.status(500).send(err);
        }
        res.send(rows);
    });
});

// 

// CREATE Data API
// POST Method se data ko add karne ke liye post method use karte hai
//  data ko add karne ke liye post method use karte hai

app.post("/contacts", (req, res) => {
    const { first_name, last_name, email, phone, address } = req.body; // sara data req.body mein aayega
    // destructuring se data ko alag alag variable mein le liya
    //req.body se data milta hai chahhe wo form-data ho ya json data ho 
    // req.body se data milta hai aur hum o variables mein store kar lete hai assign kr lete hai
    // ab hum in variables ko use kar sakte hai

    let sql = "INSERT INTO contacts (first_name, last_name, email, phone, address) VALUES (?, ?, ?, ?, ?)"; // yha pe humne ? use kiya hai jaha pe hum values denge
    let values = [first_name, last_name, email, phone, address]; // yha pe humne values ko array mein store kiya hai

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).send(err);
        
        res.send({ 
            status: "success", 
            message: "Contact created successfully!",
            id: result.insertId 
        });
    });
});

// Read single contact by ID
app.get("/contacts/:id", (req, res) => {
    let id = req.params.id; // URL parameter se id milti hai 
    let sql = "SELECT * FROM contacts WHERE id=?"; // yha pe hum id ke basis pe data fetch karenge

    db.query(sql, id, (err, row) => {
        if (err) return res.status(500).send(err);
        
        res.send(row);
    });
});

// UPDATE Data API
//  put Method se data ko update karne ke liye put method use karte hai
//  data ko update karne ke liye put method use karte hai
app.put("/contacts/:id", (req, res) => { // yha pe :id se hum url parameter se id le rahe hai
    const { first_name, last_name, email, phone, address } = req.body; // updated data req.body se milta hai
    let id = req.params.id; // url parameter se id milti hai

    let sql = "UPDATE contacts SET first_name=?, last_name=?, email=?, phone=?, address=? WHERE id=?";
    let values = [first_name, last_name, email, phone, address, id];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).send(err);
        
        res.send({ 
            status: "updated", 
            message: "Contact updated successfully!",
            affectedRows: result.affectedRows 
        });
    });
});

// DELETE Data API
app.delete("/contacts/:id", (req, res) => {
    let id = req.params.id;

    let sql = "DELETE FROM contacts WHERE id=?";

    db.query(sql, id, (err, result) => {
        if (err) return res.status(500).send(err);
        
        res.send({ 
            status: "deleted", 
            message: "Contact deleted successfully!",
            affectedRows: result.affectedRows 
        });
    });
});

// Default Route
app.get("/", (req, res) => {
    res.send("Hello World! MySQL API is Ready With Updated Contact Schema.");
});

// SERVER START
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
