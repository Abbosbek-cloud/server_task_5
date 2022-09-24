const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Email is required"],
      index: true,
      validate: [isEmail, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    newMessages: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: "online",
    },
  },
  {
    minimize: false,
  }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
