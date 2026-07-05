import { useState, useEffect } from "react";

// This form is reused for BOTH creating a new task and editing an
// existing one. If "editingTask" is passed in, we pre-fill the form;
// otherwise it starts blank. This avoids writing two near-identical forms.
export default function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });
  const [dateError, setDateError] = useState("");

  const formatDateValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = formatDateValue(new Date());
  const maxDate = formatDateValue(new Date(new Date().getFullYear() + 50, new Date().getMonth(), new Date().getDate()));

  const validateDate = (value) => {
    if (!value) return "";

    const selectedDate = new Date(`${value}T00:00:00`);
    const earliestDate = new Date(`${today}T00:00:00`);
    const latestDate = new Date(`${maxDate}T00:00:00`);

    if (selectedDate < earliestDate) {
      return "No backdated tasks can be added.";
    }

    if (selectedDate > latestDate) {
      return "Tasks can be added for at most the next 50 years.";
    }

    return "";
  };

  // Whenever "editingTask" changes (i.e. user clicked "Edit" on a task),
  // sync the form fields to that task's current values.
  useEffect(() => {
    if (editingTask) {
      const nextDueDate = editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "";
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "todo",
        priority: editingTask.priority || "medium",
        dueDate: nextDueDate,
      });
      setDateError(validateDate(nextDueDate));
    } else {
      setDateError("");
    }
  }, [editingTask]);

  const handleChange = (e) => {
    // Generic handler: works for every field because we use e.target.name
    // to know which key in "form" to update.
    const { name, value } = e.target;

    if (name === "dueDate") {
      setDateError(validateDate(value));
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationMessage = validateDate(form.dueDate);

    if (validationMessage) {
      setDateError(validationMessage);
      return;
    }

    setDateError("");
    onSubmit(form);
    setForm({ title: "", description: "", status: "todo", priority: "medium", dueDate: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="task-form-intro">
        <div>
          <p className="eyebrow">Quick capture</p>
          <h3>{editingTask ? "Refine this task" : "Add your next win"}</h3>
        </div>
        <span className="mini-pill">{editingTask ? "Editing" : "Fresh idea"}</span>
      </div>

      <input
        name="title"
        placeholder="What deserves your attention?"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Add a little context, a spark, or a next step..."
        value={form.description}
        onChange={handleChange}
      />

      <div className="form-row">
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          min={today}
          max={maxDate}
        />
      </div>

      {dateError && (
        <div className="date-error" role="alert">
          <strong>Warning:</strong> {dateError}
        </div>
      )}
      <p className="form-hint">A clear title is enough to start. Priorities and deadlines keep the momentum real.</p>

      <div className="form-row">
        <button type="submit">{editingTask ? "Save changes" : "Add to board"}</button>
        {editingTask && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
