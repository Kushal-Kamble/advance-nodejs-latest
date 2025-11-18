/*

✔ फायदे:

साफ पता चलता है function किस controller से आ रहा है
Variable naming consistency रहती है (controller.createUser)

🟦 अब समझते हैं controller variable क्या है:
const controller = require("../controllers/userController");


यहाँ:

controller एक variable है

जिसके अंदर पूरा object आ रहा है जो controller file export करता है

मतलब:

controller = {
   createUser: function,
   getUsers: function,
   getUser: function,
   updateUser: function,
   deleteUser: function
}


इसलिए फिर से function access करने के लिए controller.createUser लिखना पड़ता है।

*/

const express = require("express");
const router = express.Router();

// यहाँ हम पूरा controller object import कर रहे हैं
// मतलब controller = { createUser, getUsers, getUser, updateUser, deleteUser }
const controller = require("../controllers/userController");

// Create User
router.post("/create", controller.createUser);

// Get All Users
router.get("/", controller.getUsers);

// Get Single User
router.get("/:id", controller.getUser);

// Update User
router.put("/:id", controller.updateUser);

// Delete User
router.delete("/:id", controller.deleteUser);

module.exports = router;
