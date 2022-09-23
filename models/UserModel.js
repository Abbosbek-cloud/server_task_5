const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Username is required"],
  },
  penFriends: [
    {
      name: {
        type: String,
        required: [true, "Friend name should be exist!"],
      },
      messages: [
        {
          message: { type: String },
          from: { type: String },
          to: { type: String },
        },
      ],
    },
  ],
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
