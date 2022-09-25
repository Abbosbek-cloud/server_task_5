const router = require("express").Router();
const { signInUser, signUpUser } = require("../controllers/user");
const User = require("../models/User");

// creating user
router.post("/", signUpUser);

// login user

router.post("/login", signInUser);

module.exports = router;
