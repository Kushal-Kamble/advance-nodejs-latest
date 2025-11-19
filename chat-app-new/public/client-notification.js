// Auto Notification Permission Ask on page load
document.addEventListener("DOMContentLoaded", () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});



const socket = io();

// DOM elements
const msgBox = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const typingStatus = document.getElementById("typingStatus");
const toggleBtn = document.getElementById("disconnectBtn");
const notifyBtn = document.getElementById("notifyBtn");

// ----------------------
// Notification Permission
// ----------------------
notifyBtn.onclick = () => {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            alert("Notifications Enabled!");
        } else {
            alert("Please allow notification in browser settings.");
        }
    });
};

// Function for notifications
function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("New Message", {
            body: message,
            icon: "https://cdn-icons-png.flaticon.com/512/1384/1384005.png" // WhatsApp-style icon
        });
    }
}

// ---------- Toggle Connect / Disconnect ----------
toggleBtn.onclick = (e) => {
    e.preventDefault();

    if (socket.connected) {
        socket.disconnect();
        toggleBtn.innerText = "Connect";
        toggleBtn.classList.remove("btn-danger");
        toggleBtn.classList.add("btn-success");
    } else {
        socket.connect();
        toggleBtn.innerText = "Disconnect";
        toggleBtn.classList.remove("btn-success");
        toggleBtn.classList.add("btn-danger");
    }
};

// ---------- Send Message ----------
sendBtn.onclick = () => {
    const msg = input.value.trim();
    if (!msg || !socket.connected) return;

    socket.emit("chatMessage", msg);
    addMessage(msg, true);
    input.value = "";
};

// Press Enter = Typing
input.addEventListener("keydown", () => {
    if (socket.connected) socket.emit("typing", true);
});

// Stop typing
input.addEventListener("keyup", () => {
    clearTimeout(window.typingTimeout);

    window.typingTimeout = setTimeout(() => {
        if (socket.connected) socket.emit("typing", false);
    }, 800);
});

// ---------- Receive Messages ----------
socket.on("chatMessage", (msg) => {
    addMessage(msg, false);

    // 🔥 Notification Trigger (when message comes)
    if (!document.hasFocus()) { 
        showNotification(msg);
    }
});

// ---------- Typing Indicator ----------
socket.on("typing", (isTyping) => {
    typingStatus.style.display = isTyping ? "block" : "none";
});

// ---------- Add Message Function ----------
function addMessage(text, isMine) {
    const div = document.createElement("div");

    div.className = isMine ? "myMsg" : "otherMsg";

    const time = moment().format("DD MMM, hh:mm A");

    div.innerHTML = `${text}<br><span class="time">${time}</span>`;

    msgBox.appendChild(div);

    msgBox.scrollTop = msgBox.scrollHeight;
}
