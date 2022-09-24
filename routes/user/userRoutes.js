const router = require("express").Router();
const User = require("../../models/UserModel");

// sign up user
router.post("/", async (req, res) => {
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
});

// login
router.post("/login", async (retryWrites) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    user.status = "online";
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//

module.exports = router;
