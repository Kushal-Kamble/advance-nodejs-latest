@echo off

:: ============================================
::      JWT Authentication Auto Folder Setup
:: ============================================

:: Root Folder
mkdir jwt-auth-practice
cd jwt-auth-practice

:: Main Files
type nul > package.json
type nul > .env
type nul > index.js
type nul > README.md

:: Create Folders
mkdir config
mkdir controllers
mkdir models
mkdir routes
mkdir middleware

:: Inside Folders → Create Files
type nul > config\db.js
type nul > controllers\userController.js
type nul > models\userModel.js
type nul > routes\userRoutes.js
type nul > middleware\authMiddleware.js

echo.
echo ===============================================
echo    ✅ JWT Auth Project Folder Created!
echo ===============================================
echo.
echo Next Steps:
echo   cd jwt-auth-practice
echo   npm init -y
echo   npm install express dotenv jsonwebtoken bcryptjs mysql2 sequelize cors nodemon
echo.
pause
