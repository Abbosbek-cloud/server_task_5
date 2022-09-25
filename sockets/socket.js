const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // socket for users
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });

  // for meessages specific room
  socket.on("join-room", async (room) => {
    socket.join(room);
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  // sockets for sending messages
  socket.on("message-room", async (room, content, sender, time, date) => {
    const newMessage = await MessageModel.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortMessagesByDate(roomMessages);

    // sends message to the room
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });

  app.delete("/logout", async (req, res) => {
    try {
      const { _id, newMessages } = req.body;
      const user = await User.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      const members = await User.find();
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      res.status(400).send();
    }
  });
});
