let express = require("express");
let app = express();
let http = require("http");
let server = http.createServer(app);
let { Server } = require("socket.io");
let path = require("path");
let io = new Server(server);
let users = [];
let messages = [];
let roles = ["werewolf", "warlock", "seer", "hunter", "villager"];
let isGameStarted = false;
let phase = "day";

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.use((req, res) => {
  res.status(404);
  res.send("404");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

io.on("connection", (socket) => {
  // receive on socket, emit on io
  socket.on("user connected", (name) => {
    // todo: deal with game already started

    users.push({ name, id: socket.id });

    io.emit("user connected", { users, messages });

    // fixme: make higher
    if (users.length > 1) {
      startGame();
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.id !== socket.id);
    io.emit(`user disconnected`, users);
  });

  socket.on("chat message", (message) => {
    messages.push(message);
    io.emit("chat message", messages);
  });
});

function startGame() {
  isGameStarted = true;
  phase = "night";
  let shuffledRoles = shuffle(roles);
  users.forEach((user, i) => {
    user.role = shuffledRoles[i];
    io.to(user.id).emit("start game", user.role);
  });
}

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
