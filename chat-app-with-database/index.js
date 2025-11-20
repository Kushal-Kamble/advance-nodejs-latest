// index.js
// -----------------------------
// Express + Socket.io + MongoDB (Mongoose)
// Features:
// - Username login (simple prompt from client)
// - Online users list (real-time)
// - Message store in MongoDB
// - Serve public files
// हिंदी में comments दिए हुए
// -----------------------------

const express = require("express");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const Message = require("./models/Message"); // Mongoose model

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ---------- MongoDB Connection ----------
const MONGO_URL = "mongodb://127.0.0.1:27017/chat-app-db"; // use provided host
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB connected:", MONGO_URL);
}).catch((err) => {
    console.error("❌ MongoDB connection error:", err);
});

// Serve static public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Endpoint to fetch last 100 messages (for history)
app.get("/messages", async (req, res) => {
    try {
        const messages = await Message.find()
            .sort({ createdAt: 1 }) // oldest first
            .limit(200)
            .lean();
        res.json({ ok: true, messages });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Keep track of online users: socketId -> username
const onlineUsers = new Map();

// Helper to broadcast current online users
function broadcastUsers() {
    const users = Array.from(onlineUsers.values());
    io.emit("onlineUsers", users);
}

// ---------------- Socket.io ----------------
io.on("connection", (socket) => {
    console.log("📡 Socket connected:", socket.id);

    // Client should emit "join" with username after connecting
    socket.on("join", async (username) => {
        username = String(username || "Guest").trim().slice(0, 30);
        onlineUsers.set(socket.id, username);
        console.log(`👤 ${username} joined (${socket.id})`);

        // send updated online users list
        broadcastUsers();

        // Optionally emit welcome to the socket
        socket.emit("joined", { username });

        // announce to others (broadcast) that user joined
        socket.broadcast.emit("systemMessage", `${username} joined the chat`);

        // Optionally send some recent messages handled on client via /messages endpoint
    });

    // chat message event
    socket.on("chatMessage", async (payload) => {
        // payload can be text or object; we expect a text string
        try {
            const username = onlineUsers.get(socket.id) || "Guest";
            const text = String(payload).trim();
            if (!text) return;

            // Save to DB
            const doc = await Message.create({ username, text, createdAt: new Date() });

            // Prepare message object to broadcast
            const msgObj = {
                _id: doc._id,
                username: doc.username,
                text: doc.text,
                createdAt: doc.createdAt
            };

            // Send to all other clients (excluding sender)
            socket.broadcast.emit("chatMessage", msgObj);

            // Send back to sender as confirmation (so sender can display own msg if needed)
            socket.emit("chatMessage:me", msgObj);

            // Optionally log
            console.log(`💬 ${username}: ${text}`);
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    // typing indicator
    socket.on("typing", (isTyping) => {
        const username = onlineUsers.get(socket.id) || "Guest";
        // broadcast to others that this user is typing
        socket.broadcast.emit("typing", { username, isTyping });
    });

    // disconnect
    socket.on("disconnect", () => {
        const username = onlineUsers.get(socket.id);
        if (username) {
            console.log(`❌ ${username} disconnected (${socket.id})`);
            onlineUsers.delete(socket.id);
            // notify others
            socket.broadcast.emit("systemMessage", `${username} left the chat`);
            broadcastUsers();
        } else {
            console.log("Socket disconnected:", socket.id);
        }
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
