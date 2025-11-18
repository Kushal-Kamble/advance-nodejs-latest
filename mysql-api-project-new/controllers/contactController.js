// Database pool import
const db = require("../config/db");

/* -------------------------------------------
   GET: Saare contacts_new read karne ka function
--------------------------------------------*/
exports.getContacts = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM contacts_new");
        res.send(rows); // Saare contacts front-end ya Postman ko bhej do
    } catch (err) {
        res.status(500).send(err);
    }
};

//Function: Saare contacts ko database se fetch karta hai.

// Route: GET /contactsnew


// **********************************************************************

/* -------------------------------------------
   POST: Ek new contact create karne ka function
--------------------------------------------*/
exports.createContact = async (req, res) => {
    // Frontend ya Postman se milne wale data
    const { first_name, last_name, email, phone, address } = req.body; // hume sara data req.body se milega

    try {
        const [result] = await db.query(
            "INSERT INTO contacts_new (first_name, last_name, email, phone, address) VALUES (?, ?, ?, ?, ?)",
            [first_name, last_name, email, phone, address]
        );

        res.send({
            status: "success",
            message: "Contact created successfully!",
            id: result.insertId
        });

    } catch (err) {
        res.status(500).send(err);
    }
};

// Function: Database me naya contact insert karta hai.
// Route: POST /contactsnew
//  **********************************************

/* -------------------------------------------
   PUT: Contact update karne ka function
--------------------------------------------*/
exports.updateContact = async (req, res) => {
    const { first_name, last_name, email, phone, address } = req.body; //
    const { id } = req.params;

    try {
        const [result] = await db.query(
            "UPDATE contacts_new SET first_name=?, last_name=?, email=?, phone=?, address=? WHERE id=?",
            [first_name, last_name, email, phone, address, id]
        );

        res.send({
            status: "updated",
            message: "Contact updated!",
            affected: result.affectedRows
        });

    } catch (err) {
        res.status(500).send(err);
    }
};
// Function: Specific ID wale contact ko update karta hai.
// Route: PUT /contactsnew/:id
// *************************************

/* -------------------------------------------
   DELETE: Contact delete karne ka function
--------------------------------------------*/
exports.deleteContact = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            "DELETE FROM contacts_new WHERE id=?",
            [id]
        );

        res.send({
            status: "deleted",
            message: "Contact removed!",
            affected: result.affectedRows
        });

    } catch (err) {
        res.status(500).send(err);
    }
};

// Function: Specific ID wale contact ko delete karta hai.

// Route: DELETE /contactsnew/:id
//
