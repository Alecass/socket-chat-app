const express = require("express");
const socket = require("socket.io");
const app = express();

const server = app.listen("3002", () => {
  console.log("Server Running on Port 3002...");
});

io = socket(server);

io.on("connection", (socket) => {

  socket.emit("get_id", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data.room);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data.content);
  });

  socket.on("send_private_emoji", (id) => {
    io.to(id).emit('receive_private_emoji','🥊');
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });

});
