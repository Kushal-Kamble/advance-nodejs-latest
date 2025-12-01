@echo off

:: ==============================================
::   Task System Project - Auto Folder Setup
:: ==============================================

:: Root Folder
mkdir task-system
cd task-system

:: Main Files
type nul > server.js
type nul > .env
type nul > package.json
type nul > README.md

:: Folders
mkdir config
mkdir models
mkdir controllers
mkdir middleware
mkdir routes
mkdir views
mkdir public
mkdir public\css
mkdir public\js
mkdir public\images
mkdir utils

:: Config Files
type nul > config\db.js

:: Models
type nul > models\User.js
type nul > models\Task.js

:: Controllers
type nul > controllers\authController.js
type nul > controllers\taskController.js
type nul > controllers\adminController.js

:: Middleware
type nul > middleware\auth.js
type nul > middleware\isAdmin.js
type nul > middleware\upload.js

:: Routes
type nul > routes\authRoutes.js
type nul > routes\taskRoutes.js
type nul > routes\adminRoutes.js

:: Views
type nul > views\login.ejs
type nul > views\register.ejs
type nul > views\dashboard.ejs
type nul > views\admin_dashboard.ejs

:: Public static files
type nul > public\css\style.css
type nul > public\js\main.js

:: Utils
type nul > utils\mailer.js
type nul > utils\cronJob.js

echo.
echo ==============================================
echo   ✅ Task System Project Structure Created!
echo ==============================================
echo.
echo Next Steps:
echo   cd task-system
echo   npm init -y
echo   npm install express mongoose dotenv bcryptjs jsonwebtoken multer nodemailer ejs cookie-parser express-session node-cron
echo.
pause
