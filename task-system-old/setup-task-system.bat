@echo off

:: ===================================================
::     Task System Project Auto Folder Setup
:: ===================================================

:: Root Folder
mkdir task-system
cd task-system

:: Main Files
type nul > package.json
type nul > server.js
type nul > .env
type nul > README.md

:: Create Folders
mkdir config
mkdir cron
mkdir controllers
mkdir middleware
mkdir models
mkdir routes
mkdir utils
mkdir public
mkdir public\css
mkdir public\js
mkdir public\js\employee
mkdir public\js\manager
mkdir public\js\admin
mkdir public\libs
mkdir public\uploads
mkdir views
mkdir views\employee
mkdir views\manager
mkdir views\admin

:: Config Files
type nul > config\db.js

:: Cron Jobs
type nul > cron\reminders.js

:: Controllers
type nul > controllers\authController.js
type nul > controllers\taskController.js
type nul > controllers\managerController.js
type nul > controllers\adminController.js

:: Middleware
type nul > middleware\auth.js
type nul > middleware\roleCheck.js

:: Models
type nul > models\User.js
type nul > models\Task.js
type nul > models\TaskHistory.js

:: Routes
type nul > routes\authRoutes.js
type nul > routes\taskRoutes.js
type nul > routes\managerRoutes.js
type nul > routes\adminRoutes.js

:: Utils
type nul > utils\mailer.js

:: Public CSS
type nul > public\css\login.css
type nul > public\css\dashboard.css

:: Public JS
type nul > public\js\employee\dashboard.js
type nul > public\js\manager\dashboard.js
type nul > public\js\admin\admin.js

:: Public Libs
type nul > public\libs\bootstrap.min.css
type nul > public\libs\bootstrap.bundle.min.js
type nul > public\libs\tabulator.min.js
type nul > public\libs\tabulator.min.css
type nul > public\libs\moment.min.js

:: Views
type nul > views\login.ejs
type nul > views\register.ejs
type nul > views\employee\dashboard.ejs
type nul > views\manager\dashboard.ejs
type nul > views\admin\dashboard.ejs

echo.
echo ====================================================
echo   ✅ Task System Project Structure Created!
echo ====================================================
echo.
echo Next Steps:
echo   cd task-system
echo   npm init -y
echo   npm install express mongoose dotenv bcryptjs jsonwebtoken ejs cors multer nodemailer node-cron
echo.
pause
