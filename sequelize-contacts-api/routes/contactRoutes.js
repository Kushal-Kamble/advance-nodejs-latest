const express = require("express");
const router = express.Router();
const controller = require("../controllers/contactController");


// Create Contact (FORM - x-www-form-urlencoded or JSON)
router.post("/", controller.createContact);


// Read All
router.get("/", controller.getContacts);


// Read One
router.get("/:id", controller.getContact);


// Update
router.put("/:id", controller.updateContact);


// Delete
router.delete("/:id", controller.deleteContact);


module.exports = router;