const express = require("express");
const router = express.Router();
const { register, login, getUser } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/user", getUser);

module.exports = router;
