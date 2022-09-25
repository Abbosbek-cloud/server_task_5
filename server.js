const express = require("express");
const app = express();
const userRouter = require("./routes/user/userRoutes");

const rooms = ["General", "Technology", "Finance", "Crypto"];
const cors = require("cors");
const MessageModel = require("./models/MessageModel");
const User = require("./models/UserModel");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
require("./connection");

const server = require("http").createServer(app);
const PORT = process.env.PORT || 5000;

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let dat = 'curl "https://api.example.com/socket.io/?EIO=4&transport=polling"';
let ap = "https://localhost:5000/socket.io/?EIO=4&transport=polling&t=ODomLlr.";
app.get("/rooms", (req, res) => {
  res.json(rooms);
});

const getLastMessagesFromRoom = async (room) => {
  let roomMessages = await MessageModel.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messageById: { $push: "$$ROOT" } } },
  ]);

  return roomMessages;
};

const sortMessagesByDate = (messages) => {
  return messages.sort((a, b) => {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date1 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
};

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
    console.log(content);
    const newMessage = await MessageModel.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    console.log(roomMessages);
    roomMessages = sortMessagesByDate(roomMessages);

    // sends message to the room
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });
});

server.listen(PORT, () => console.log("Listening to ", PORT));
