const fs = require("fs");

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

folders.forEach(dir => fs.mkdirSync(dir, { recursive: true }));
files.forEach(file => fs.writeFileSync(file, ""));

console.log("Mongoose CRUD project structure created!");
