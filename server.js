let express = require("express");
let app = express();
let http = require("http");
let server = http.createServer(app);
let { Server } = require("socket.io");
let io = new Server(server);
let users = [];
let messages = [];

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on("connection", (socket) => {
  // receive on socket, emit on io
  socket.on(`new user`, (name) => {
    users.push({ id: socket.id, name });
    io.emit("user connected", { users, messages });
  });

  socket.on("user connected", () => {
    console.log(users, messages);
    io.emit("user connected", { users, messages });
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

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
