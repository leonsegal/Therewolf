let express = require("express");
let app = express();
let http = require("http");
let server = http.createServer(app);
let { Server } = require("socket.io");
let io = new Server(server);
let users = [];

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on("connection", (socket) => {
  // receive on socket, emit on io
  socket.on(`check user`, (name) => {
    if (users.includes(name)) {
      io.emit("user exists", name);
    } else {
      users.push(name);
      io.emit("user registered", name);
    }
  });

  socket.on("user connected", (name) => {
    io.emit("user connected", name);
  });

  socket.on("disconnect", (name) => {
    io.emit(`user disconnected`, name);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
