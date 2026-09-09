import { useEffect, useState } from "react";
import {
  Check,
  Plus,
  Trash2,
  Edit3,
  ListTodo,
  Clock,
  CalendarDays,
  Play,
  RotateCcw,
  BarChart3,
  Target,
  Settings,
  LayoutDashboard,
} from "lucide-react";

import { supabase } from "./utils/supabase";
import DashboardNav from "./Dashboardnav";
import "./Dashboard.css";

function Dashboard({
  darkMode,
  setShowDashboard,
  setIsLoggedIn,
}) {
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("Study");

  const [time, setTime] = useState(new Date());

  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Study");

  const [activePage, setActivePage] = useState("overview");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          setTimerRunning(false);
          return 25 * 60;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  const editTask = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditCategory(task.category);
  };

  const saveEdit = () => {
    if (!editTitle.trim()) return;

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === editingTask.id
          ? {
              ...item,
              title: editTitle.trim(),
              category: editCategory,
            }
          : item
      )
    );

    setEditingTask(null);
    setEditTitle("");
    setEditCategory("Study");
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: Date.now(),
        title: newTask.trim(),
        category,
        completed: false,
      },
    ]);

    setNewTask("");
  };

  const clearCompleted = () => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => !task.completed)
    );
  };

  const toggleTimer = () => {
    setTimerRunning((current) => !current);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  const minutes = Math.floor(timerSeconds / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (timerSeconds % 60)
    .toString()
    .padStart(2, "0");

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return;
    }

    setIsLoggedIn(false);
    setShowDashboard(false);
  };

  return (
    <div
      className={`dashboard ${
        darkMode ? "dashboard-dark" : ""
      }`}
    >
      <main className="dashboard-content">

        {/* DASHBOARD NAVIGATION */}
        <DashboardNav
          activePage={activePage}
          setActivePage={setActivePage}
        />

        {/* ================= OVERVIEW ================= */}

        {activePage === "overview" && (
          <>
            <div className="top-area">
              <div className="date-box">
                <strong>
                  {time.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>

                <span>
                  {time.toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </span>
              </div>

              <div className="welcome-box">
                <h1>Let's make today productive.</h1>
                <p>
                  Stay consistent and keep moving forward.
                </p>
              </div>

              <div className="clock-box">
                {time.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <section className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon orange">
                  <ListTodo size={25} />
                </div>

                <div>
                  <span className="stat-title">
                    All Tasks
                  </span>

                  <strong className="stat-number orange-text">
                    {totalTasks}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">
                  <Check size={25} />
                </div>

                <div>
                  <span className="stat-title">
                    Done
                  </span>

                  <strong className="stat-number green-text">
                    {completedTasks}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon dark-icon">
                  <Clock size={25} />
                </div>

                <div>
                  <span className="stat-title">
                    In Progress
                  </span>

                  <strong className="stat-number dark-text">
                    {pendingTasks}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon red-icon">
                  <CalendarDays size={25} />
                </div>

                <div>
                  <span className="stat-title">
                    Pending
                  </span>

                  <strong className="stat-number red-text">
                    {pendingTasks}
                  </strong>
                </div>
              </div>

            </section>

            <div className="dashboard-grid">

              <div className="left-column">

                <section className="add-task-section">
                  <h2>Add New Task</h2>

                  <div className="add-task-row">

                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) =>
                        setNewTask(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addTask();
                        }
                      }}
                      placeholder="What do you want to do?"
                    />

                    <div className="category-select-wrapper">
                      <select
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value)
                        }
                      >
                        <option value="Study">
                          Study
                        </option>

                        <option value="Personal">
                          Personal
                        </option>

                        <option value="Health">
                          Health
                        </option>

                        <option value="Project">
                          Project
                        </option>
                      </select>
                    </div>

                    <button
                      className="add-button"
                      onClick={addTask}
                    >
                      <Plus size={21} />
                      Add Task
                    </button>

                  </div>
                </section>

                <section className="tasks-section">

                  <div className="tasks-heading">
                    <h2>My Tasks</h2>
                    <span>{totalTasks} tasks</span>
                  </div>

                  <div className="task-list">

                    {tasks.length === 0 ? (
                      <div className="empty-tasks">
                        <p>No tasks yet.</p>
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <div
                          className={`task-item ${
                            task.completed
                              ? "task-completed"
                              : ""
                          }`}
                          key={task.id}
                        >

                          <button
                            className={`task-check ${
                              task.completed
                                ? "checked"
                                : ""
                            }`}
                            onClick={() =>
                              toggleTask(task.id)
                            }
                          >
                            {task.completed && (
                              <Check size={16} />
                            )}
                          </button>

                          <div className="task-title">
                            <h3>{task.title}</h3>
                          </div>

                          <span
                            className={`category ${task.category.toLowerCase()}`}
                          >
                            {task.category}
                          </span>

                          <div className="task-actions">

                            <button
                              onClick={() =>
                                editTask(task)
                              }
                            >
                              <Edit3 size={17} />
                            </button>

                            <button
                              onClick={() =>
                                deleteTask(task.id)
                              }
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>

                        </div>
                      ))
                    )}

                  </div>

                  <div className="tasks-footer">

                    <span>
                      {completedTasks} of {totalTasks}{" "}
                      completed
                    </span>

                    {completedTasks > 0 && (
                      <button
                        onClick={clearCompleted}
                      >
                        Clear completed
                        <Trash2 size={15} />
                      </button>
                    )}

                  </div>

                </section>

              </div>

              <div className="right-column">

                <section className="weekly-section">

                  <h2>Today's Progress</h2>

                  <div className="completion-area">

                    <div
                      className="progress-ring"
                      style={{
                        "--progress": `${progress * 3.6}deg`,
                      }}
                    >
                      <div>
                        <strong>{progress}%</strong>
                      </div>
                    </div>

                    <div className="completion-text">

                      <strong>
                        {completedTasks} of {totalTasks}{" "}
                        tasks
                      </strong>

                      <span>completed</span>

                    </div>

                  </div>

                  <div className="weekly-divider" />

                  <div className="timer-card">

                    <div className="timer-header">

                      <div>
                        <Clock size={20} />
                        <strong>Focus Timer</strong>
                      </div>

                      <span>25 min focus</span>

                    </div>

                    <div className="timer-display">
                      {minutes}:{seconds}
                    </div>

                    <div className="timer-controls">

                      <button
                        className="timer-start"
                        onClick={toggleTimer}
                      >
                        <Play size={18} />

                        {timerRunning
                          ? "Pause"
                          : "Start"}
                      </button>

                      <button
                        className="timer-reset"
                        onClick={resetTimer}
                      >
                        <RotateCcw size={18} />
                      </button>

                    </div>

                  </div>

                </section>

              </div>

            </div>
          </>
        )}

        {/* ================= TASKS ================= */}

        {activePage === "tasks" && (
          <section className="dashboard-page">

            <div className="dashboard-page-heading">
              <div>
                <span className="page-label">
                  TASK MANAGEMENT
                </span>

                <h1>My Tasks</h1>

                <p>
                  Create, edit, complete, and manage your
                  tasks.
                </p>
              </div>

              <div className="page-icon">
                <ListTodo size={28} />
              </div>
            </div>

            <section className="add-task-section">

              <h2>Add New Task</h2>

              <div className="add-task-row">

                <input
                  type="text"
                  value={newTask}
                  onChange={(e) =>
                    setNewTask(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTask();
                    }
                  }}
                  placeholder="What do you want to do?"
                />

                <div className="category-select-wrapper">
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                  >
                    <option value="Study">
                      Study
                    </option>

                    <option value="Personal">
                      Personal
                    </option>

                    <option value="Health">
                      Health
                    </option>

                    <option value="Project">
                      Project
                    </option>
                  </select>
                </div>

                <button
                  className="add-button"
                  onClick={addTask}
                >
                  <Plus size={21} />
                  Add Task
                </button>

              </div>

            </section>

            <section className="tasks-section">

              <div className="tasks-heading">
                <h2>All Tasks</h2>
                <span>{totalTasks} tasks</span>
              </div>

              <div className="task-list">

                {tasks.length === 0 ? (
                  <div className="empty-tasks">
                    <p>No tasks yet.</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      className={`task-item ${
                        task.completed
                          ? "task-completed"
                          : ""
                      }`}
                      key={task.id}
                    >

                      <button
                        className={`task-check ${
                          task.completed
                            ? "checked"
                            : ""
                        }`}
                        onClick={() =>
                          toggleTask(task.id)
                        }
                      >
                        {task.completed && (
                          <Check size={16} />
                        )}
                      </button>

                      <div className="task-title">
                        <h3>{task.title}</h3>
                      </div>

                      <span
                        className={`category ${task.category.toLowerCase()}`}
                      >
                        {task.category}
                      </span>

                      <div className="task-actions">

                        <button
                          onClick={() =>
                            editTask(task)
                          }
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          onClick={() =>
                            deleteTask(task.id)
                          }
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>
                  ))
                )}

              </div>

              <div className="tasks-footer">

                <span>
                  {completedTasks} of {totalTasks}{" "}
                  completed
                </span>

                {completedTasks > 0 && (
                  <button onClick={clearCompleted}>
                    Clear completed
                    <Trash2 size={15} />
                  </button>
                )}

              </div>

            </section>

          </section>
        )}

        {/* ================= PROGRESS ================= */}

        {activePage === "progress" && (
          <section className="dashboard-page">

            <div className="dashboard-page-heading">
              <div>
                <span className="page-label">
                  PRODUCTIVITY
                </span>

                <h1>Progress</h1>

                <p>
                  See how much you've completed and keep
                  improving.
                </p>
              </div>

              <div className="page-icon">
                <BarChart3 size={28} />
              </div>
            </div>

            <div className="progress-page-grid">

              <div className="progress-big-card">

                <div
                  className="progress-ring large"
                  style={{
                    "--progress": `${progress * 3.6}deg`,
                  }}
                >
                  <div>
                    <strong>{progress}%</strong>
                  </div>
                </div>

                <h2>Overall Completion</h2>

                <p>
                  {completedTasks} of {totalTasks} tasks
                  completed
                </p>

              </div>

              <div className="progress-stats">

                <div className="progress-stat">
                  <div className="page-stat-icon orange">
                    <ListTodo size={22} />
                  </div>

                  <div>
                    <span>Total Tasks</span>
                    <strong>{totalTasks}</strong>
                  </div>
                </div>

                <div className="progress-stat">
                  <div className="page-stat-icon green">
                    <Check size={22} />
                  </div>

                  <div>
                    <span>Completed</span>
                    <strong>{completedTasks}</strong>
                  </div>
                </div>

                <div className="progress-stat">
                  <div className="page-stat-icon dark-icon">
                    <Target size={22} />
                  </div>

                  <div>
                    <span>Remaining</span>
                    <strong>{pendingTasks}</strong>
                  </div>
                </div>

              </div>

            </div>

          </section>
        )}

        {/* ================= SETTINGS ================= */}

        {activePage === "settings" && (
          <section className="dashboard-page">

            <div className="dashboard-page-heading">
              <div>
                <span className="page-label">
                  PREFERENCES
                </span>

                <h1>Settings</h1>

                <p>
                  Manage your FitUp dashboard preferences.
                </p>
              </div>

              <div className="page-icon">
                <Settings size={28} />
              </div>
            </div>

            <div className="settings-list">

              <div className="settings-item">

                <div>
                  <h3>Appearance</h3>

                  <p>
                    Change the appearance of your dashboard
                    using the theme button in the main
                    navigation.
                  </p>
                </div>

                <span className="settings-status">
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </span>

              </div>

              <div className="settings-item">

                <div>
                  <h3>Tasks</h3>

                  <p>
                    You currently have {totalTasks} tasks
                    in your dashboard.
                  </p>
                </div>

                <span className="settings-status">
                  {totalTasks} tasks
                </span>

              </div>

              <div className="settings-item">

                <div>
                  <h3>Account</h3>

                  <p>
                    Sign out of your FitUp account.
                  </p>
                </div>

                <button
                  className="settings-signout"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>

              </div>

            </div>

          </section>
        )}

        <div className="dashboard-footer">

          <p>
            Stay focused and keep making progress.
          </p>

          <button onClick={handleSignOut}>
            Sign out
          </button>

        </div>

      </main>

      {/* ================= EDIT TASK ================= */}

      {editingTask && (
        <div
          className="edit-overlay"
          onClick={() => setEditingTask(null)}
        >
          <div
            className="edit-box"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>Edit Task</h2>

            <input
              type="text"
              value={editTitle}
              onChange={(e) =>
                setEditTitle(e.target.value)
              }
              placeholder="Task name"
            />

            <p>Choose category</p>

            <div className="edit-categories">

              {[
                "Study",
                "Personal",
                "Health",
                "Project",
              ].map((item) => (
                <button
                  key={item}
                  className={`edit-category ${item.toLowerCase()} ${
                    editCategory === item
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setEditCategory(item)
                  }
                >
                  {item}
                </button>
              ))}

            </div>

            <div className="edit-actions">

              <button
                className="cancel-edit"
                onClick={() =>
                  setEditingTask(null)
                }
              >
                Cancel
              </button>

              <button
                className="save-edit"
                onClick={saveEdit}
              >
                Save Changes
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;