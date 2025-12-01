@echo off

:: ================================================
::   Task System Project - Auto Folder Setup
:: ================================================

:: Root Folder
mkdir task-system
cd task-system

:: Main Files
type nul > server.js
type nul > package.json
type nul > .env.example
type nul > README.md

:: Folders
mkdir config
mkdir controllers
mkdir middleware
mkdir models
mkdir routes
mkdir views
mkdir public
mkdir public\css
mkdir public\js
mkdir public\voice

:: Config
type nul > config\db.js

:: Controllers
type nul > controllers\authController.js
type nul > controllers\taskController.js

:: Middleware
type nul > middleware\isLoggedIn.js
type nul > middleware\isAdmin.js

:: Models
type nul > models\User.js
type nul > models\Task.js

:: Routes
type nul > routes\authRoutes.js
type nul > routes\taskRoutes.js

:: Views
type nul > views\login.ejs
type nul > views\register.ejs
type nul > views\dashboard.ejs

:: Public Files
type nul > public\css\login.css
type nul > public\js\script.js
type nul > public\voice\voice.js

echo.
echo ================================================
echo   ✅ Task System Project Structure Created!
echo ================================================
echo.
echo Next Steps:
echo   cd task-system
echo   npm init -y
echo   npm install express mongoose dotenv bcryptjs jsonwebtoken cookie-parser ejs cors
echo.
pause
