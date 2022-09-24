const User = require("../models/UserModel");

// signin controller
const loginFunc = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    user.status = "online";
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// signup controller
const signUpFunc = async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    const user = await User.create({ name, email, password, picture });
    res.status(200).send(user);
  } catch (error) {
    let message;
    if (error.code === 11000) {
      message = "User is already exists";
    } else {
      message = error.message;
    }
    res.status(400).send(message);
  }
};

module.exports = { loginFunc, signUpFunc };
