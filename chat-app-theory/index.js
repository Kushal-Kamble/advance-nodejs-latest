// -------------------------------------------
//  NodeJS + ExpressJS + Socket.io Chat Server
//  हिंदी में Step-by-Step Explanation
// -------------------------------------------

// Express को import किया
const express = require("express");

// HTTP मॉड्यूल import किया ताकि socket.io को attach कर सकें
const http = require("http");

// Express app बनाया
const app = express();

// Public folder को static बना दिया
app.use(express.static("public"));

// HTTP Server बनाया और Express को इसके अंदर डाल दिया
const server = http.createServer(app);

// अब Socket.io को server के साथ जोड़ना है
const { Server } = require("socket.io");
const io = new Server(server);

// --------------------------------------------
//  जब भी कोई client connection बनाएगा
// --------------------------------------------
io.on("connection", function (socket) {
    console.log("नया यूजर जुड़ा:", socket.id);

    // Client से message सुनना
    socket.on("chatMessage", function (data) {
        // अब यह message सब को भेजना (broadcast)
        io.emit("chatMessage", data);
    });

    // User disconnect
    socket.on("disconnect", function () {
        console.log("यूजर डिस्कनेक्ट:", socket.id);
    });
});

// Server run
server.listen(5000, function () {
    console.log("🚀 Server Running at http://localhost:5000");
});
