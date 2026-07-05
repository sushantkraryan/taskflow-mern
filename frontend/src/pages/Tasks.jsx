import { useState, useEffect } from "react";
import api from "../api/axios";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import { useAuth } from "../context/AuthContext";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const openTasks = totalTasks - completedTasks;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const orderedTasks = [...tasks].sort((a, b) => Number(b.favorite) - Number(a.favorite) || new Date(b.createdAt) - new Date(a.createdAt));
  const filteredTasks = orderedTasks.filter((task) => {
    const searchValue = search.toLowerCase();
    const matchesSearch = !searchValue || task.title?.toLowerCase().includes(searchValue) || task.description?.toLowerCase().includes(searchValue);
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });
  const activeTasks = filteredTasks.filter((task) => task.status !== "done");
  const completedTaskList = filteredTasks.filter((task) => task.status === "done");
  const nextFocusTask = [...activeTasks].sort((a, b) => Number(b.favorite) - Number(a.favorite) || new Date(a.createdAt) - new Date(b.createdAt))[0];

  const moodTitle =
    totalTasks === 0
      ? "A fresh board is a happy start."
      : completedTasks === totalTasks
      ? "You cleared the board."
      : openTasks <= 2
      ? "A few wins left to go."
      : "Momentum is building.";

  const moodCopy =
    totalTasks === 0
      ? "Drop in your first task and let the day feel lighter."
      : completedTasks === totalTasks
      ? "Every checked-off task is a tiny victory."
      : nextFocusTask
      ? `Next up: ${nextFocusTask.title}`
      : "Capture ideas fast and keep your day feeling calm and clear.";

  // Fetch tasks whenever filters change. The empty deps + filters dep
  // means: run once on mount, then again any time "filters" changes.
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Build query params only from filters that are actually set.
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;

      const { data } = await api.get("/tasks", { params });
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    if (editingTask) {
      // Update existing task
      const { data } = await api.put(`/tasks/${editingTask._id}`, formData);
      setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
      setEditingTask(null);
    } else {
      // Create new task
      const { data } = await api.post("/tasks", formData);
      setTasks([data, ...tasks]);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const handleToggleFavorite = async (task) => {
    const { data } = await api.put(`/tasks/${task._id}`, { ...task, favorite: !task.favorite });
    setTasks(tasks.map((item) => (item._id === task._id ? data : item)));
  };

  const handleStatusChange = async (task, nextStatus) => {
    const { data } = await api.put(`/tasks/${task._id}`, { ...task, status: nextStatus });
    setTasks(tasks.map((item) => (item._id === task._id ? data : item)));

    if (nextStatus === "done") {
      const celebration = document.createElement("div");
      celebration.className = "celebration-pop";
      celebration.textContent = "✨ Done!";
      document.body.appendChild(celebration);
      setTimeout(() => celebration.remove(), 1100);
    }
  };

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <div className="header-copy">
          <div className="brand-badge brand-badge-inline">TaskFlow</div>
          <h1>Plan clearly. Ship calmly.</h1>
          <p>Keep your work focused, your priorities visible, and your day moving.</p>
        </div>
        <div className="header-actions">
          <div className="profile-pill">
            <span className="profile-dot" />
            <span>Hi, {user?.name}</span>
          </div>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="workspace-shell">
        <div className="dashboard-highlights">
          <div className="hero-spotlight">
            <div>
              <p className="eyebrow">Today’s focus</p>
              <h3>{moodTitle}</h3>
              <p>{moodCopy}</p>
            </div>
            <div className="hero-score">
              <span>{completionRate}%</span>
              <small>complete</small>
            </div>
          </div>

          <div className="insight-grid">
            <div className="insight-card">
              <span>Open tasks</span>
              <strong>{openTasks}</strong>
            </div>
            <div className="insight-card">
              <span>Done</span>
              <strong>{completedTasks}</strong>
            </div>
            <div className="insight-card">
              <span>Total</span>
              <strong>{totalTasks}</strong>
            </div>
          </div>
        </div>

        <TaskForm
          onSubmit={handleCreateOrUpdate}
          editingTask={editingTask}
          onCancel={() => setEditingTask(null)}
        />

        <div className="filters">
          <input
            type="text"
            placeholder="Search tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {loading ? (
          <p className="empty-state">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty-state">No tasks yet — add one above and let TaskFlow keep you on track.</p>
        ) : (
          <>
            <div className="task-section">
              <div className="task-section-title">
                <div>
                  <h3>Focus board</h3>
                  <span>{activeTasks.length} active</span>
                </div>
                <p>Star the important ones and keep your momentum rolling.</p>
              </div>
              {activeTasks.length === 0 ? (
                <p className="empty-state">Nothing active right now — your next win is waiting.</p>
              ) : (
                <div className="task-list">
                  {activeTasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onEdit={setEditingTask}
                      onDelete={handleDelete}
                      onToggleFavorite={handleToggleFavorite}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="task-section completed-section">
              <div className="task-section-title">
                <div>
                  <h3>Completed wins</h3>
                  <span>{completedTaskList.length} wrapped</span>
                </div>
                <p>Celebrate progress and reopen anything you want to keep moving.</p>
              </div>
              {completedTaskList.length === 0 ? (
                <p className="empty-state">No completed tasks yet — every finished step counts.</p>
              ) : (
                <div className="task-list">
                  {completedTaskList.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onEdit={setEditingTask}
                      onDelete={handleDelete}
                      onToggleFavorite={handleToggleFavorite}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
