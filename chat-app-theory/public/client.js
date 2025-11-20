// ------------------------------------------
//  Client Side Socket.io + DOM Handling
// ------------------------------------------

// सर्वर से कनेक्शन बनाना
const socket = io();

// DOM elements
const input = document.getElementById("messageInput");
const send = document.getElementById("sendBtn");
const messages = document.getElementById("messages");

// बटन पर क्लिक करने पर मैसेज भेजना
send.addEventListener("click", sendMessage);

// Enter दबाने पर भी मैसेज भेजे
input.addEventListener("keyup", function (e) {
    if (e.key === "Enter") sendMessage();
});

// ------------------------------------------
//  मैसेज भेजने का फंक्शन
// ------------------------------------------
function sendMessage() {
    if (input.value.trim() === "") return;

    const data = {
        text: input.value,
        time: moment().format("h:mm A")
    };

    // क्लाइंट → सर्वर
    socket.emit("chatMessage", data);

    input.value = "";
}

// ------------------------------------------
//  सर्वर → सभी क्लाइंट्स (मैसेज रिसीव)
// ------------------------------------------
socket.on("chatMessage", function (data) {
    const div = document.createElement("div");

    div.classList.add("message", "other");
    div.innerHTML = `<strong>${data.text}</strong>  
                     <div style="font-size:12px; opacity:0.7;">${data.time}</div>`;

    messages.appendChild(div);

    // Scroll bottom
    messages.scrollTop = messages.scrollHeight;
});
