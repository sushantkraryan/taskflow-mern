const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"], // like a Java enum
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
    // This is the foreign key relationship — like @ManyToOne in JPA.
    // It stores the ObjectId of the User who owns this task, and
    // "ref" tells Mongoose which collection to look in when we .populate() it.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
