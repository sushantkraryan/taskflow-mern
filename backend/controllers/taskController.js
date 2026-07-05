const { listTasks, createTask: createStoredTask, updateTask: updateStoredTask, deleteTask: deleteStoredTask } = require("../utils/storage");

// GET /api/tasks  (supports ?status=todo&priority=high query filters)
const getTasks = async (req, res) => {
  try {
    const filter = {};

    // Optional filters — only applied if the client sends them.
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await listTasks(req.userId, filter);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, favorite, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await createStoredTask({
      title,
      description,
      status,
      priority,
      favorite,
      dueDate,
      user: req.userId, // comes from our auth middleware, not the client body
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await updateStoredTask(req.params.id, req.userId, req.body);

    if (!task) {
      // Either it doesn't exist, or it belongs to someone else —
      // we return the same 404 either way so we don't leak info.
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await deleteStoredTask(req.params.id, req.userId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
