const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jtmcbhm.mongodb.net/task_5?retryWrites=true&w=majority`,
  () => {
    console.log("connected to mongodb");
  }
);
