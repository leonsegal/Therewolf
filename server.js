let express = require("express");
let app = express();
let path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

let cors = require("cors");
app.use(cors());

app.use((req, res) => {
  res.status(404);
  res.send("404");
});

let http = require("http");
let server = http.createServer(app);

server.listen(4500, () => {
  console.log("Server is running on port 4500");
});

let { Server } = require("socket.io");
// cors config set here:
let io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
let players = [];
let requiredPlayers = 2;
let messages = [];

io.on("connection", (socket) => {
  // receive on socket, emit on io

  socket.on("reconnect player", (id) => {
    let player = players.find((player) => player.id === id);
    player.socketID = socket.id;
    io.emit("player connected", { players, messages });
  });

  socket.on("register player", ({ name, id }) => {
    let player = { name, id, socketID: socket.id, role: null, isAlive: true };
    players.push(player);
    io.emit("player connected", { players, messages });

    players.length === requiredPlayers && startGame();
  });

  socket.on("disconnect", () => {
    players = players.filter((player) => player.socketID !== socket.id);
    io.emit(`player disconnected`, players);
  });

  socket.on("chat message", (message) => {
    messages.push(message);
    io.emit("chat message", messages);
  });
});

let isGameStarted = false;
let phase = "day";
let roles = [
  {
    name: "werewolf",
    description:
      "Each night you get to select a victim to kill. \nYou win if it's just you and a non-hunter left.",
  },
  {
    name: "seer",
    description:
      "Each night you can select a player to uncover their role. \nYou win if all werewolves are eliminated.",
  },
  {
    name: "villager",
    description:
      "You have to find the werewolf and lynch them. \nYou win if all werewolves are eliminated",
  },
  // { name: "medic", description: "" },
  // { name: "warlock", description: "" },
  // { name: "hunter", description: "" },
];
let shuffledRoles = shuffle(roles);

function getDescription(role) {
  return "description" + role;
}

function startGame() {
  isGameStarted = true;
  phase = "night";
  players.forEach((player, i) => {
    player.role = shuffledRoles[i];
    let role = player.role;
    let description = getDescription(role);
    io.to(player.id).emit("start game", { role, description });
  });
}

function shuffle(array) {
  let iCurrent = array.length;
  let iRandom;

  // While un-shuffled elems
  while (iCurrent !== 0) {
    // Pick un-shuffled elem
    iRandom = Math.floor(Math.random() * iCurrent);
    iCurrent--;

    // Swap with current elem
    [array[iCurrent], array[iRandom]] = [array[iRandom], array[iCurrent]];
  }

  return array;
}
