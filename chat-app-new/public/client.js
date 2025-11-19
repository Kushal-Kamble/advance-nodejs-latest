// -------------------------------------------
// Auto Ask Notification Permission on Page Load
// -------------------------------------------
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

// -------------------------------------------
// Manual Notification Permission Button
// -------------------------------------------
notifyBtn.onclick = () => {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            alert("Notifications Enabled!");
        } else {
            alert("Please allow notification manually in browser settings.");
        }
    });
};

// -------------------------------------------
// Chrome Notification Function
// -------------------------------------------
function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("New Message", {
            body: message,
            icon: "https://cdn-icons-png.flaticon.com/512/1384/1384005.png"
        });
    }
}

// -------------------------------------------
// Toggle Connect / Disconnect Button
// -------------------------------------------
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

// ------- Enter Press = Send Message + Typing event -------
input.addEventListener("keydown", (e) => {
    if (socket.connected) socket.emit("typing", true);
    if (e.key === "Enter") {
        e.preventDefault();
        sendBtn.click();
    }
});

// -------------------------------------------
// Send Message with ID for Read Receipts
// -------------------------------------------
sendBtn.onclick = () => {
    const msg = input.value.trim();
    if (!msg || !socket.connected) return;

    const msgId = "msg-" + Date.now(); // unique ID
    socket.emit("chatMessage", { text: msg, id: msgId });
    addMessage(msg, true, msgId, "✓ Delivered"); // Sender sees delivered initially
    input.value = "";
};

// Typing Start / Stop
input.addEventListener("keydown", () => {
    if (socket.connected) socket.emit("typing", true);
});
input.addEventListener("keyup", () => {
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
        if (socket.connected) socket.emit("typing", false);
    }, 800);
});

// -------------------------------------------
// Receive Messages
// -------------------------------------------
socket.on("chatMessage", (data) => {
    addMessage(data.text, false, data.id, ""); // Receiver doesn't show status
    socket.emit("messageDelivered", data.id); // Notify sender
    if (!document.hasFocus()) showNotification(data.text);
});

// Sender gets "Seen" notification
socket.on("messageSeen", (msgId) => {
    const msgElem = document.getElementById(msgId);
    if (msgElem) {
        const status = msgElem.querySelector(".status");
        if (status) status.innerText = "✓✓ Seen";
    }
});

// Typing Indicator
socket.on("typing", (isTyping) => {
    typingStatus.style.display = isTyping ? "block" : "none";
});

// -------------------------------------------
// Add Chat Bubble to Screen with status & delete
// -------------------------------------------
function addMessage(text, isMine, id, statusText) {
    const div = document.createElement("div");
    div.className = isMine ? "myMsg" : "otherMsg";
    div.id = id;

    const time = moment().format("DD MMM, hh:mm A");

    const deleteBtn = isMine ? `<button onclick="deleteMessage('${id}')" class="deleteBtn">🗑️</button>` : "";
    const statusSpan = isMine ? `<span class="status">${statusText}</span>` : "";

    div.innerHTML = `${text} ${deleteBtn}<br><span class="time">${time}</span> ${statusSpan}`;

    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
}

// -------------------------------------------
// Delete Message
// -------------------------------------------
function deleteMessage(id) {
    const msgElem = document.getElementById(id);
    if (msgElem) {
        msgElem.remove();
        socket.emit("deleteMessage", id); // Notify other users
    }
}

// -------------------------------------------
// Notify Server that message is seen (on hover or click)
// -------------------------------------------
msgBox.addEventListener("mouseover", (e) => {
    const msgElem = e.target.closest("div");
    if (msgElem && !msgElem.classList.contains("myMsg")) {
        socket.emit("messageSeen", msgElem.id);
    }
});
