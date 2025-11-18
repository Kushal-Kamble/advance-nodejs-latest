@echo off
:: ============================
:: MySQL API Project Auto Setup
:: ============================

:: Root Folder
mkdir mysql-api-project
cd mysql-api-project

:: Main Files
type nul > .env
type nul > package.json
type nul > index.js

:: Create Folders
mkdir config
mkdir routes
mkdir controllers
mkdir public
mkdir postman

:: Inside Folders → Create Files
type nul > config\db.js
type nul > routes\contactRoutes.js
type nul > controllers\contactController.js

:: Public Files
type nul > public\index.html
type nul > public\style.css

:: Postman Collection Placeholder
type nul > postman\mysql-api-collection.json

echo.
echo ==============================================
echo  ✅ MySQL API Project Folder Created Successfully!
echo ==============================================
echo.
echo Next Step:
echo   cd mysql-api-project
echo   npm init -y
echo   npm install express mysql2 dotenv nodemon
echo.
pause
