const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Admin creates manager
router.post('/create-manager', auth, role(['admin']), userCtrl.createManager);

// Manager creates employee
router.post('/create-employee', auth, role(['manager']), userCtrl.createEmployee);

// Manager: get my employees
router.get('/employees', auth, role(['manager']), userCtrl.getMyEmployees);

module.exports = router;
