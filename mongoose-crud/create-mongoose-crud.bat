@echo off
:: ============================================
::   Mongoose CRUD Project Auto Folder Setup
:: ============================================

:: Root Folder
mkdir mongoose-crud
cd mongoose-crud

:: Main Files
type nul > package.json
type nul > .env
type nul > index.js
type nul > README.md

:: Create Folders
mkdir config
mkdir models
mkdir controllers
mkdir routes

:: Inside Folders → Create Files
type nul > config\db.js
type nul > models\Restaurant.js
type nul > controllers\restaurantController.js
type nul > routes\restaurantRoutes.js

echo.
echo ===============================================
echo  ✅ Mongoose CRUD Project Folder Created Successfully!
echo ===============================================
echo.
echo Next Step:
echo   cd mongoose-crud
echo   npm init -y
echo   npm install express mongoose dotenv cors nodemon
echo.
pause
