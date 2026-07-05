const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../utils/storage");

// Small helper — generates a signed JWT containing the user's id.
// It expires in 7 days here; adjust as you like.
const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: "7d",
  });
};

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await createUser({ name, email, password });
    if (!user) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      // Deliberately vague — don't reveal whether the email exists.
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { signup, login };
