
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const chatArea = document.getElementById("chatArea");
const newChat = document.getElementById("newChat");
const history = document.getElementById("history");

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  messages.appendChild(message);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function sendMessage(text) {
  const cleanText = text.trim();
  if (!cleanText) return;

  welcome.style.display = "none";

  addMessage(cleanText, "user");
  input.value = "";

  // Backend connection will be added in the next step.
  addMessage(
    "NOVA AI's interface is ready! We will connect the AI backend in the next step.",
    "assistant"
  );

  history.innerHTML = "<p>New conversation</p>";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

document.querySelectorAll(".suggestion").forEach((button) => {
  button.addEventListener("click", () => {
    sendMessage(button.dataset.prompt);
  });
});

newChat.addEventListener("click", () => {
  messages.innerHTML = "";
  welcome.style.display = "block";
  history.innerHTML = "<p>No conversations yet</p>";
  input.focus();
});

document.getElementById("menuButton").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("open");
});
