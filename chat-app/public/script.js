// socket.io server se connect ho rahe hain
const socket = io();


const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");


// send button click event
sendBtn.addEventListener("click", () => {
const msg = input.value;


if (msg.trim() !== "") {
socket.emit("chatMessage", msg); // server ko message bhejna
input.value = "";
}
});


// jab server se message aaye
socket.on("chatMessage", (msg) => {
const div = document.createElement("div");
div.textContent = msg;
messages.appendChild(div);
messages.scrollTop = messages.scrollHeight; // auto scroll
});