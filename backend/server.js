require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware — runs on every incoming request, in order.
app.use(cors()); // allows the React app (different port) to call this API
app.use(express.json()); // parses JSON request bodies into req.body

// Connect to MongoDB before we start accepting traffic.
connectDB();

// Mount our routers under a base path — like @RequestMapping("/api/auth")
// on a Spring @RestController class.
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Simple health check route.
app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
