const BACKEND_URL = "http://127.0.0.1:5000";

/* ================= AUTH ================= */

function register() {
    fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            name: "User"
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.user_id) {
            localStorage.setItem("user_id", data.user_id);
            window.location.href = "dashboard.html";
        } else {
            alert(data.error);
        }
    });
}

function login() {
    fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.user_id) {
            localStorage.setItem("user_id", data.user_id);
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid credentials");
        }
    });
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

/* ================= DASHBOARD ================= */

let userId = localStorage.getItem("user_id");

if (window.location.pathname.includes("dashboard.html") && !userId) {
    window.location.href = "login.html";
}

window.onload = function() {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
        document.getElementById("chat-box").innerHTML = saved;
    }
};

function saveChat() {
    const chatBox = document.getElementById("chat-box");
    localStorage.setItem("chatHistory", chatBox.innerHTML);
}

function clearChat() {
    localStorage.removeItem("chatHistory");
    document.getElementById("chat-box").innerHTML = "";
}

/* ================= CHAT ================= */

function sendMessage() {

    const messageInput = document.getElementById("message");
    const message = messageInput.value;

    if (!message) return;

    const chatBox = document.getElementById("chat-box");

    chatBox.innerHTML += `
        <div class="message user-message">
            ${message}
        </div>
    `;

    messageInput.value = "";
    saveChat();

    fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: userId,
            message: message
        })
    })
    .then(res => res.json())
    .then(data => {
        chatBox.innerHTML += `
            <div class="message assistant-message">
                ${data.response}
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
        saveChat();
    });
}

/* ================= UPLOAD ================= */

function uploadReport() {

    const fileInput = document.getElementById("reportFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Select a file first");
        return;
    }

    const chatBox = document.getElementById("chat-box");

    const formData = new FormData();
    formData.append("file", file);

    fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(uploadData => {

        return fetch(`${BACKEND_URL}/chat`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                user_id: userId,
                message: "Analyze this report",
                image_path: uploadData.path
            })
        });

    })
    .then(res => res.json())
    .then(chatData => {

        chatBox.innerHTML += `
            <div class="message user-message">
                Uploaded report
            </div>
        `;

        chatBox.innerHTML += `
            <div class="message assistant-message">
                ${chatData.response}
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;
        saveChat();
    });
}
