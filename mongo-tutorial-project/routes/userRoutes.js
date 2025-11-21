const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST → नया user
router.post('/', userController.createUser);

// GET → सारे users
router.get('/', userController.getUsers);

// GET → एक user by ID
router.get('/:id', userController.getUserById);

// PUT → update user
router.put('/:id', userController.updateUser);

// DELETE → remove user
router.delete('/:id', userController.deleteUser);

module.exports = router;
