const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const protect = require("../middleware/auth");

const router = express.Router();

// "protect" runs first on EVERY route below — like applying a
// Spring Security filter chain to a specific set of endpoints.
// If the token is missing/invalid, the request never reaches the controller.
router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
