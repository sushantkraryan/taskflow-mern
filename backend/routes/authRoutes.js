const express = require("express");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

// These map directly to @PostMapping("/signup") and @PostMapping("/login")
// if you're thinking in Spring Boot terms.
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
