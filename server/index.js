const express = require("express");
const socket = require("socket.io");
const app = express();

const server = app.listen("3002", () => {
  console.log("Server Running on Port 3002...");
});

io = socket(server);

io.on("connection", (socket) => {

  socket.on("send_message", (message) => {
    socket.broadcast.emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });

});
