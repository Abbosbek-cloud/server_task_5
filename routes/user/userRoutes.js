const router = require("express").Router();
const { loginFunc, signUpFunc } = require("../../controllers/user");

// sign up user
router.post("/", signUpFunc);

// login
router.post("/login", loginFunc);

module.exports = router;
