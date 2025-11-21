// 🟠 PART 1 — require() (CommonJS)
// Node.js ka default system → esme “type: module” ki ज़रूरत नहीं पड़ती.

// ✅ Example using require()
// ✔️ CommonJS style (DEFAULT Node.js)
// ✔️ Isko chalane ke liye package.json me kuch add NHI karna parta

const express = require('express');  //  require use kiya

const app = express();

app.get('/', (req, res) => {
  res.send("Hello World - using require()");
});

app.listen(5000, () => {
  console.log("Server 5000 par chal raha hai...");
});



/*

📝 Hindi Explanation:

require() Node.js ka purana aur default tarika hai modules import karne ka

Yah without configuration kaam karta hai

Sare Node.js tutorials, old projects isi ko use karte hain

*/
