const express = require("express"); // express import
const http = require("http"); // http module import (socket.io ke liye jaruri)
const { Server } = require("socket.io"); // socket.io server class


const app = express(); // express app create


// public folder ko static bana rahe hain
app.use(express.static("public"));


// http server create kar rahe hain jiske andar express app attach hai
const server = http.createServer(app);


// socket.io ko http server ke sath attach karte hain
const io = new Server(server);


// jab bhi koi client connect hoga
io.on("connection", (socket) => {
console.log("Client Connected :", socket.id);


// client ne message bheja
socket.on("chatMessage", (msg) => {
// sabhi connected clients ko message send karo
io.emit("chatMessage", msg);
});


// jab koi client disconnect ho jaye
socket.on("disconnect", () => {
console.log("Client Disconnected :", socket.id);
});
});


// server run
server.listen(5000, () => {
console.log("Server running on port 5000");
});