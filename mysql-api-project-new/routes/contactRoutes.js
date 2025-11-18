const express = require("express");
const router = express.Router();
const controller = require("../controllers/contactController");

router.get("/", controller.getContacts);        // Read All contacts
router.post("/", controller.createContact);     // Create new contact
router.put("/:id", controller.updateContact);   // Update contact by id
router.delete("/:id", controller.deleteContact);// Delete contact by id

module.exports = router;


/*


Explanation (Hindi)

router.get("/") → /contactsnew/ pe GET request → getContacts function run hoga.

router.post("/") → /contactsnew/ pe POST request → createContact function run hoga.

router.put("/:id") → /contactsnew/:id pe PUT request → updateContact function run hoga.

router.delete("/:id") → /contactsnew/:id pe DELETE request → deleteContact function run hoga.

Summary: Routes basically URL endpoints aur HTTP methods ko specific controller functions ke saath link karte hain.

*/
