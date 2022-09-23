const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  userId: {
    type: String,
    required: [true, "UserId is required!"],
  },
});

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
