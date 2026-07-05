const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Task = require("../models/Task");

mongoose.set("bufferCommands", false);

const syncMongoAvailability = () => {
  global.__mongoAvailable = Boolean(global.__mongoAvailable);
};

const memoryUsers = [];
const memoryTasks = [];

const isMongoConnected = () => {
  syncMongoAvailability();
  return Boolean(global.__mongoAvailable) && mongoose.connection.readyState === 1 && !!mongoose.connection.db;
};

const createMemoryUser = async ({ name, email, password }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = {
    _id: `memory-user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
    comparePassword: async function (candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    },
  };

  memoryUsers.push(user);
  return user;
};

const createUser = async ({ name, email, password }) => {
  if (isMongoConnected()) {
    try {
      return await User.create({ name, email, password });
    } catch (error) {
      console.warn("MongoDB user create failed, using in-memory fallback:", error.message);
    }
  }

  const existingUser = memoryUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return null;
  }

  return createMemoryUser({ name, email, password });
};

const findUserByEmail = async (email) => {
  if (isMongoConnected()) {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      console.warn("MongoDB user lookup failed, using in-memory fallback:", error.message);
    }
  }

  return memoryUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
};

const listTasks = async (userId, filters = {}) => {
  if (isMongoConnected()) {
    try {
      const query = { user: userId };
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;

      return await Task.find(query).sort({ favorite: -1, createdAt: -1 });
    } catch (error) {
      console.warn("MongoDB task list failed, using in-memory fallback:", error.message);
    }
  }

  return memoryTasks
    .filter((task) => task.user === userId)
    .filter((task) => (!filters.status || task.status === filters.status))
    .filter((task) => (!filters.priority || task.priority === filters.priority))
    .sort((a, b) => Number(b.favorite) - Number(a.favorite) || new Date(b.createdAt) - new Date(a.createdAt));
};

const createTask = async (taskData) => {
  if (isMongoConnected()) {
    try {
      return await Task.create(taskData);
    } catch (error) {
      console.warn("MongoDB task create failed, using in-memory fallback:", error.message);
    }
  }

  const task = {
    _id: `memory-task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...taskData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  memoryTasks.push(task);
  return task;
};

const updateTask = async (taskId, userId, updates) => {
  if (isMongoConnected()) {
    try {
      return await Task.findOneAndUpdate({ _id: taskId, user: userId }, updates, {
        new: true,
      });
    } catch (error) {
      console.warn("MongoDB task update failed, using in-memory fallback:", error.message);
    }
  }

  const taskIndex = memoryTasks.findIndex((task) => task._id === taskId && task.user === userId);
  if (taskIndex === -1) {
    return null;
  }

  memoryTasks[taskIndex] = {
    ...memoryTasks[taskIndex],
    ...updates,
    updatedAt: new Date(),
  };

  return memoryTasks[taskIndex];
};

const deleteTask = async (taskId, userId) => {
  if (isMongoConnected()) {
    try {
      return await Task.findOneAndDelete({ _id: taskId, user: userId });
    } catch (error) {
      console.warn("MongoDB task delete failed, using in-memory fallback:", error.message);
    }
  }

  const taskIndex = memoryTasks.findIndex((task) => task._id === taskId && task.user === userId);
  if (taskIndex === -1) {
    return null;
  }

  const [deletedTask] = memoryTasks.splice(taskIndex, 1);
  return deletedTask;
};

module.exports = {
  createUser,
  findUserByEmail,
  listTasks,
  createTask,
  updateTask,
  deleteTask,
};
