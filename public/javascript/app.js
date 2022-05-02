// let socket = io.connect("http://localhost:4500"); // declared at top
let socket = io();

let introModal = document.getElementById("intro-modal");
let introModalClose = document.getElementById("intro-modal-close");
introModalClose.onclick = () => (introModal.style.display = "none");

let roleModal = document.getElementById("role-modal");
let roleModalClose = document.getElementById("role-modal-close");
roleModalClose.onclick = () => (roleModal.style.display = "none");

let outroModal = document.getElementById("outro-modal");
let outroModalClose = document.getElementById("outro-modal-close");
outroModalClose.onclick = () => (outroModal.style.display = "none");

window.onclick = (e) => {
  if (e.target === introModal) {
    introModal.style.display = "none";
  }

  if (e.target === roleModal) {
    roleModal.style.display = "none";
  }

  if (e.target === outroModal) {
    outroModal.style.display = "none";
  }
};

let playerSection = document.querySelector("#players ul");
let messagePanel = document.querySelector("#messages");
let isGameStarted = sessionStorage.getItem("isGameStarted");

socket.on("player connected", ({ players, messages }) => {
  if (isGameStarted !== true) {
    introModal.style.display = "block";
  }

  playerSection.innerHTML = buildPlayers(players);
  messagePanel.innerHTML = buildMessages(messages);

  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("player disconnected", (players) => {
  playerSection.innerHTML = buildPlayers(players);
});

socket.on("chat message", (messages) => {
  messagePanel.innerHTML = buildMessages(messages);

  window.scrollTo(0, document.body.scrollHeight);
});

let playerRole = null;

socket.on("start game", ({ role, description }) => {
  playerRole = role;
  alert(`Your role: ${role}\n${description}`);
  isGameStarted = true;
  sessionStorage.setItem("isGameStarted", "true");
});

let playerName = getName();
registerPlayer(playerName);

function getName() {
  let playerName = sessionStorage.getItem("name");

  if (playerName) {
    return playerName;
  }

  playerName = prompt("What's your name?");

  if (!playerName) {
    getName();
  }

  return playerName;
}

function registerPlayer(name) {
  sessionStorage.setItem("name", name);

  socket.emit("player connected", name);
}

function buildPlayers(players) {
  return players.reduce(
    (output, player) =>
      output +
      `<li>${(player.name += player.name === playerName ? "(you)" : "")}</li>`,
    ""
  );
}

function buildMessages(messages) {
  return messages.reduce(
    (output, message) => output + `<li>${message.name}: ${message.text}</li>`,
    ""
  );
}

let input = document.getElementById("input");
let form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit("chat message", { name: playerName, text: input.value });
    input.value = "";
  }
});
