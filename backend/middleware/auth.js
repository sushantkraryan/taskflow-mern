const jwt = require("jsonwebtoken");

// This is the Node equivalent of a Spring Security JWT filter — it runs
// BEFORE the route handler, checks for a valid token, and either lets
// the request through (calling next()) or rejects it.
const protect = (req, res, next) => {
  // Client sends the token like: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify checks the signature AND expiry using our secret key.
    // If it's invalid/expired, this throws and we catch it below.
    const jwtSecret = process.env.JWT_SECRET || "dev-secret";
    const decoded = jwt.verify(token, jwtSecret);

    // Attach the user's id to the request so route handlers know
    // WHO is making the request — same idea as SecurityContextHolder
    // giving you the authenticated principal in Spring.
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = protect;
