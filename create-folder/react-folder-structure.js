const fs = require("fs");
const path = require("path");

const folders = [
  "config",
  "models",
  "controllers",
  "routes"
];

const files = [
  "package.json",
  ".env",
  "index.js",
  "README.md",
  "config/db.js",
  "models/Restaurant.js",
  "controllers/restaurantController.js",
  "routes/restaurantRoutes.js"
];

// Create all folders
folders.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log("📁 Folder created:", dir);
});

// Create all files
files.forEach(file => {
  fs.writeFileSync(file, "");
  console.log("📄 File created:", file);
});

console.log("\n✔ Mongoose CRUD structure created successfully!");
