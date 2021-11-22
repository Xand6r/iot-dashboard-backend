function socketHandlers(socket, io) {
  const socketId = socket.id;

  // initialise globaly accesible variables
  global.__socketInstance = {
    io,
    socket,
  };
  // initialise globaly accesible variables
  console.log("A user has just connected, socketId:", socketId);

  socket.on("disconnect", () => {
    // take an action upon disconnect
    console.log("A user has just disconnected, socketId:", socketId);
  });
}

module.exports = socketHandlers;