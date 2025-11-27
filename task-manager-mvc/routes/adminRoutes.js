const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// GET /api/admin/stats
router.get('/stats', auth, role(['admin']), adminCtrl.getStats);

module.exports = router;
