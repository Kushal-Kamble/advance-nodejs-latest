const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ensure upload folder exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, unique);
  }
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB

// Manager creates task
router.post('/', auth, role(['manager']), upload.single('file'), taskCtrl.createTask);

// Manager lists tasks assigned by this manager
router.get('/assigned', auth, role(['manager']), taskCtrl.getTasksAssignedByMe);

// User & Manager: list my tasks (role-aware)
router.get('/my-tasks', auth, taskCtrl.getMyTasks);

// Employee claims task
router.post('/:id/claim', auth, role(['user']), taskCtrl.claimTask);

// Employee completes task
router.post('/:id/complete', auth, role(['user']), taskCtrl.completeTask);

module.exports = router;
