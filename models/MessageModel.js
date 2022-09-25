const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  content: String,
  from: String,
  to: String,
  socketId: String,
  time: String,
  date: String,
});

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
