@echo off

:: ===================================================
::     Task Manager MVC Project Auto Folder Setup
:: ===================================================

:: Root Folder
mkdir task-manager-mvc
cd task-manager-mvc

:: Main Files
type nul > package.json
type nul > server.js
type nul > README.md

:: Create Folders
mkdir config
mkdir controllers
mkdir middleware
mkdir models
mkdir routes
mkdir public
mkdir public\css
mkdir public\js
mkdir public\uploads
mkdir views
mkdir views\partials
mkdir views\manager
mkdir views\employee

:: Config Files
type nul > config\db.js

:: Controllers
type nul > controllers\authController.js
type nul > controllers\taskController.js
type nul > controllers\userController.js

:: Middleware
type nul > middleware\authMiddleware.js

:: Models
type nul > models\User.js
type nul > models\Task.js

:: Routes
type nul > routes\authRoutes.js
type nul > routes\taskRoutes.js
type nul > routes\userRoutes.js

:: Public Files
type nul > public\css\style.css
type nul > public\js\login.js
type nul > public\js\managerDashboard.js
type nul > public\js\employeeDashboard.js
type nul > public\js\taskCreate.js

:: Views - Partials
type nul > views\partials\head.ejs
type nul > views\partials\navbar.ejs

:: Views - Main Pages
type nul > views\login.ejs
type nul > views\register.ejs

:: Manager Views
type nul > views\manager\dashboard.ejs
type nul > views\manager\createTask.ejs

:: Employee Views
type nul > views\employee\dashboard.ejs

echo.
echo ====================================================
echo   ✅ Task Manager MVC Project Structure Created!
echo ====================================================
echo.
echo Next Steps:
echo   cd task-manager-mvc
echo   npm init -y
echo   npm install express mongoose dotenv bcryptjs jsonwebtoken ejs cors multer nodemon
echo.
pause
