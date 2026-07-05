// A "dumb" / presentational component — it just displays one task
// and calls the functions passed in from the parent when buttons are
// clicked. It doesn't know or care HOW delete/edit actually work.
export default function TaskItem({ task, onEdit, onDelete, onToggleFavorite, onStatusChange }) {
  const statusCopy = {
    todo: "Planned",
    "in-progress": "In motion",
    done: "Wrapped",
  };

  const priorityCopy = {
    low: "Low lift",
    medium: "Medium",
    high: "High energy",
  };

  const isFavorite = Boolean(task.favorite);
  const isDone = task.status === "done";

  return (
    <div className={`task-card priority-${task.priority} ${isFavorite ? "is-favorite" : ""} ${isDone ? "is-done" : ""}`}>
      <div className="task-card-header">
        <div>
          <div className="task-card-topline">
            <p className="task-label">{priorityCopy[task.priority] || "Priority"}</p>
            {isFavorite && <span className="task-chip pinned">★ Pinned</span>}
          </div>
          <h4>{task.title}</h4>
        </div>
        <span className={`status-badge status-${task.status}`}>
          {statusCopy[task.status] || task.status}
        </span>
      </div>

      {task.description && <p>{task.description}</p>}

      <div className="task-meta">
        <span>⚡ {task.priority} priority</span>
        {task.dueDate && (
          <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
      </div>

      <div className="task-actions">
        <button type="button" className={`favorite-toggle ${isFavorite ? "active" : ""}`} onClick={() => onToggleFavorite(task)}>
          {isFavorite ? "★ Starred" : "☆ Star"}
        </button>
        <button type="button" className="secondary-action" onClick={() => onStatusChange(task, isDone ? "todo" : "done")}>
          {isDone ? "↺ Reopen" : "✓ Mark done"}
        </button>
        <button type="button" onClick={() => onEdit(task)}>Edit</button>
        <button type="button" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </div>
  );
}
