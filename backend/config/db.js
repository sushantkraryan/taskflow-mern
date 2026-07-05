const mongoose = require("mongoose");

// Equivalent to your application.properties spring.datasource.url setup,
// just done in code instead of a config file.
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskflow";

  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes("<")) {
    console.warn(
      "MONGO_URI is missing or still uses a placeholder. Trying local MongoDB at mongodb://127.0.0.1:27017/taskflow"
    );
  }

  try {
    await mongoose.connect(mongoUri);
    global.__mongoAvailable = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    global.__mongoAvailable = false;
    console.error("MongoDB connection failed:", error.message);
    console.warn("Continuing without database connection. Set a valid MONGO_URI to enable persistence.");
  }
};

module.exports = connectDB;
