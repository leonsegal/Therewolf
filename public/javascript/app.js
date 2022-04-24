let socket = io(); // declared at top of scope

let isGameOngoing =
  sessionStorage.getItem("isGameOngoing") &&
  sessionStorage.getItem("isGameOngoing") === "true";

let playerSection = document.querySelector("#players ul");
let messagePanel = document.querySelector("#messages");

let introModal = document.getElementById("intro-modal");
let introModalClose = document.getElementById("intro-modal-close");
introModalClose.onclick = () => (introModal.style.display = "none");

let roleModal = document.getElementById("role-modal");
let roleModalClose = document.getElementById("role-modal-close");
roleModalClose.onclick = () => (roleModal.style.display = "none");

let outroModal = document.getElementById("outro-modal");
let outroModalClose = document.getElementById("outro-modal-close");
outroModalClose.onclick = () => (outroModal.style.display = "none");

window.onclick = (event) => {
  if (event.target === introModal) {
    introModal.style.display = "none";
  }

  if (event.target === roleModal) {
    roleModal.style.display = "none";
  }

  if (event.target === outroModal) {
    outroModal.style.display = "none";
  }
};

let userRole = null;
let userName = getName();
registerUser(userName);

socket.on("user connected", ({ users, messages }) => {
  if (!isGameOngoing) {
    introModal.style.display = "block";
  }

  playerSection.innerHTML = buildUsers(users);
  messagePanel.innerHTML = buildMessages(messages);

  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("user disconnected", (users) => {
  playerSection.innerHTML = buildUsers(users);
});

socket.on("chat message", (messages) => {
  messagePanel.innerHTML = buildMessages(messages);

  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("start game", (role) => {
  userRole = role;
  alert(`You are ${role}`);
  isGameOngoing = true;
  sessionStorage.setItem("isGameOngoing", "true");
});

function getName() {
  let userName = sessionStorage.getItem("name");

  if (userName) {
    return userName;
  }

  userName = prompt("What's your name?");

  if (!userName) {
    getName();
  }

  return userName;
}

function registerUser(name) {
  sessionStorage.setItem("name", name);

  socket.emit("user connected", name);
}

function buildUsers(users) {
  let output = "";

  users.forEach(
    (user) =>
      (output +=
        user.name === userName
          ? `<li>${user.name} (you)</li>`
          : `<li>${user.name}</li>`)
  );

  return output;
}

function buildMessages(messages) {
  let output = "";

  messages.forEach((message) => {
    output += `<li>${message.name}: ${message.text}</li>`;
  });

  return output;
}

let input = document.getElementById("input");
let form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit("chat message", { name: userName, text: input.value });
    input.value = "";
  }
});
