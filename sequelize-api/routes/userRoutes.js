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


/*

## 🔥 API Testing URLs

| Method | URL               | Description        |
|--------|--------------------|---------------------|
| POST   | /api/users/create | नया user create     |
| GET    | /api/users/       | सभी users           |
| GET    | /api/users/:id    | एक user             |
| PUT    | /api/users/:id    | update user         |
| DELETE | /api/users/:id    | delete user         |


*/