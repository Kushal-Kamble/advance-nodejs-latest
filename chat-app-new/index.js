// -------------------------------------------
// NodeJS + ExpressJS + Socket.io Chat Server
// -------------------------------------------
const express = require("express");
const http = require("http");
const app = express();
app.use(express.static("public"));
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

// Store message status (simple in-memory object, DB optional)
let messageStatus = {}; // { msgId: { delivered: [], seen: [] } }

io.on("connection", (socket) => {
    console.log("नया यूजर जुड़ा:", socket.id);

    // -------------------------------------------
    // 1) Receive Chat Message
    // -------------------------------------------
    socket.on("chatMessage", (msg) => {
        messageStatus[msg.id] = { delivered: [], seen: [] };

        // message broadcast to all except sender
        socket.broadcast.emit("chatMessage", msg);
    });

    // -------------------------------------------
    // 2) Message Delivered
    // -------------------------------------------
    socket.on("messageDelivered", (msgId) => {
        if (messageStatus[msgId]) {
            // track delivered users
            if (!messageStatus[msgId].delivered.includes(socket.id)) {
                messageStatus[msgId].delivered.push(socket.id);
            }
        }
        // optionally sender can be notified that message is delivered
        socket.emit("messageDelivered", msgId);
    });

    // -------------------------------------------
    // 3) Message Seen
    // -------------------------------------------
    socket.on("messageSeen", (msgId) => {
        if (messageStatus[msgId]) {
            // track seen users
            if (!messageStatus[msgId].seen.includes(socket.id)) {
                messageStatus[msgId].seen.push(socket.id);
            }
        }
        // Notify **sender** only
        socket.broadcast.emit("messageSeen", msgId);
    });

    // -------------------------------------------
    // 4) Delete Message
    // -------------------------------------------
    socket.on("deleteMessage", (msgId) => {
        // Remove message from memory (optional)
        delete messageStatus[msgId];
        // Notify all clients to remove the message
        io.emit("deleteMessage", msgId);
    });

    // -------------------------------------------
    // 5) Typing Indicator
    // -------------------------------------------
    socket.on("typing", (status) => {
        socket.broadcast.emit("typing", status);
    });

    // -------------------------------------------
    // Disconnect Event
    // -------------------------------------------
    socket.on("disconnect", () => {
        console.log("यूजर डिस्कनेक्ट:", socket.id);
    });
});

server.listen(5000, () => {
    console.log("🚀 Server Running at http://localhost:5000");
});
