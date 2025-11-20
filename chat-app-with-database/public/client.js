// public/client.js
// पूरा client-side logic: login, connect, fetch history, show online users,
// typing indicator, notifications, toggle connect/disconnect, enter to send

// Auto ask notification permission once DOM loaded
document.addEventListener("DOMContentLoaded", () => {
    if (Notification && Notification.permission !== "granted") {
        Notification.requestPermission().catch(()=>{});
    }
});

const socket = io();

// DOM elements
const messagesEl = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const typingStatus = document.getElementById("typingStatus");
const toggleBtn = document.getElementById("disconnectBtn");
const notifyBtn = document.getElementById("notifyBtn");
const usersList = document.getElementById("usersList");
const meLabel = document.getElementById("meLabel");
const statusLabel = document.getElementById("statusLabel");

// login modal elements (Bootstrap modal)
const loginModalEl = document.getElementById("loginModal");
const usernameInput = document.getElementById("usernameInput");
const loginBtn = document.getElementById("loginBtn");
const bsModal = new bootstrap.Modal(loginModalEl, { backdrop: 'static', keyboard: false });

let myUsername = null;
let typingTimeout = null;

// Show login modal on start
bsModal.show();

// ---------------------- Login flow ----------------------
loginBtn.addEventListener("click", doLogin);
usernameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doLogin();
});

function doLogin() {
    const name = (usernameInput.value || "").trim().slice(0,30);
    if (!name) {
        alert("कृपया एक नाम डालें।");
        return;
    }
    myUsername = name;
    meLabel.innerText = `Username: ${myUsername}`;
    statusLabel.innerText = " (connected)";
    // emit join to socket after UI shown
    socket.emit("join", myUsername);
    bsModal.hide();

    // load previous messages from server (history)
    fetch("/messages").then(r => r.json()).then(data => {
        if (data.ok && Array.isArray(data.messages)) {
            messagesEl.innerHTML = ""; // clear
            data.messages.forEach(m => {
                addMessageToDOM(m.username, m.text, m.createdAt, m.username === myUsername ? true : false);
            });
            // scroll to bottom
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }
    }).catch(err => {
        console.warn("History load error:", err);
    });
}

// ---------------------- Notifications ----------------------
notifyBtn.onclick = () => {
    if (!("Notification" in window)) {
        alert("Notifications नहीं supported आपके ब्राउज़र में");
        return;
    }
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            alert("Notifications enabled");
        } else {
            alert("Please enable notifications in your browser settings.");
        }
    });
};

function showNotification(title, body) {
    if (Notification.permission === "granted") {
        try {
            new Notification(title, { body, icon: "/favicon.png" });
        } catch (err) {
            // ignore
        }
    }
}

// ---------------------- Toggle Connect/Disconnect ----------------------
toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (socket && socket.connected) {
        socket.disconnect();
        toggleBtn.innerText = "Connect";
        toggleBtn.classList.remove("btn-danger");
        toggleBtn.classList.add("btn-success");
        statusLabel.innerText = " (disconnected)";
    } else {
        socket.connect();
        // re-emit join so server knows this username again
        if (myUsername) socket.emit("join", myUsername);
        toggleBtn.innerText = "Disconnect";
        toggleBtn.classList.remove("btn-success");
        toggleBtn.classList.add("btn-danger");
        statusLabel.innerText = " (connected)";
    }
});

// ---------------------- Send message (button + Enter) ----------------------
function sendMessage() {
    const text = (messageInput.value || "").trim();
    if (!text) return;
    if (!socket.connected) {
        alert("Socket disconnected. Please connect first.");
        return;
    }
    // emit text
    socket.emit("chatMessage", text);

    // add to own DOM immediately (server will also emit back to others)
    addMessageToDOM(myUsername, text, new Date(), true);
    messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);

// Enter key to send (and also handle typing)
messageInput.addEventListener("keydown", (e) => {
    // typing start
    if (socket.connected) socket.emit("typing", true);

    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

// keyup to stop typing after small timeout
messageInput.addEventListener("keyup", (e) => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        if (socket.connected) socket.emit("typing", false);
    }, 700);
});

// ---------------------- Socket listeners ----------------------
socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    statusLabel.innerText = socket.connected ? " (connected)" : " (disconnected)";
    // rejoin if username present
    if (myUsername) socket.emit("join", myUsername);
});

socket.on("joined", (data) => {
    // optional
});

socket.on("systemMessage", (text) => {
    // show small system message
    const div = document.createElement("div");
    div.className = "system";
    div.innerText = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
});

socket.on("chatMessage", (msg) => {
    // msg is object: { username, text, createdAt, _id }
    addMessageToDOM(msg.username, msg.text, msg.createdAt, false);

    // show notification if window not focused and message not from me
    if (!document.hasFocus() && msg.username !== myUsername) {
        showNotification(`Message from ${msg.username}`, msg.text);
    }
});

socket.on("chatMessage:me", (msg) => {
    // server saved message and confirmed back; we already displayed sender's message locally,
    // but you may update message id or timestamp if needed.
    // For now ignore or you could find last unsaved message and attach id.
});

socket.on("typing", (data) => {
    // data: { username, isTyping }
    if (data && data.isTyping && data.username !== myUsername) {
        typingStatus.style.display = "block";
        typingStatus.innerText = `${data.username} टाइप कर रहा है...`;
    } else {
        typingStatus.style.display = "none";
    }
});

socket.on("onlineUsers", (users) => {
    // users is array of usernames
    usersList.innerHTML = "";
    users.forEach(u => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerText = u;
        usersList.appendChild(li);
    });
});

// ---------------------- helper: add message to DOM ----------------------
function addMessageToDOM(username, text, createdAt, isMine) {
    const wrapper = document.createElement("div");
    wrapper.className = "msg " + (isMine ? "me" : "other");

    const time = moment(createdAt).format("DD MMM, hh:mm A");

    wrapper.innerHTML = `<strong>${username}</strong><div>${escapeHtml(text)}</div><div class="meta">${time}</div>`;
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// small helper to escape HTML
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
