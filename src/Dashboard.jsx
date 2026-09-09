
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
  Timer,
  BarChart3,
  Target,
  Settings,
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

  const [goal, setGoal] = useState("");
  const [goalTarget, setGoalTarget] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activePage !== "focus" || !timerRunning) return;

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
  }, [activePage, timerRunning]);

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

  const goalProgress =
    goalTarget === 0
      ? 0
      : Math.min(
          Math.round((completedTasks / goalTarget) * 100),
          100
        );

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
        <DashboardNav
          activePage={activePage}
          setActivePage={setActivePage}
        />

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
                  <span className="stat-title">All Tasks</span>

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
                  <span className="stat-title">Done</span>

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
                  <span className="stat-title">In Progress</span>

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
                  <span className="stat-title">Pending</span>

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
                        <option value="Study">Study</option>
                        <option value="Personal">
                          Personal
                        </option>
                        <option value="Health">Health</option>
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
                      {completedTasks} of {totalTasks} completed
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
                        {completedTasks} of {totalTasks} tasks
                      </strong>

                      <span>completed</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </>
        )}

        {activePage === "calendar" && (
          <section className="dashboard-page">
            <div className="dashboard-page-heading">
              <div className="page-icon">
                <CalendarDays size={28} />
              </div>

              <span className="page-label">PLANNING</span>

              <h1>Calendar</h1>

              <p>
                Plan your tasks and stay organized.
              </p>
            </div>

            <div className="progress-big-card">
              <CalendarDays size={45} />

              <h2>
                {time.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>

              <p>
                Today is{" "}
                {time.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </section>
        )}

        {activePage === "focus" && (
          <section className="dashboard-page">
            <div className="dashboard-page-heading">
              <div className="page-icon">
                <Timer size={28} />
              </div>

              <span className="page-label">FOCUS</span>

              <h1>Focus Session</h1>

              <p>
                Stay focused with a simple Pomodoro timer.
              </p>
            </div>

            <div className="progress-big-card">
              <Timer size={35} />

              <div className="timer-display">
                {minutes}:{seconds}
              </div>

              <p>25 min focus session</p>

              <div className="timer-controls">
                <button
                  className="timer-start"
                  onClick={toggleTimer}
                >
                  <Play size={18} />

                  {timerRunning ? "Pause" : "Start"}
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
        )}

        {activePage === "analytics" && (
          <section className="dashboard-page">
            <div className="dashboard-page-heading">
              <div className="page-icon">
                <BarChart3 size={28} />
              </div>

              <span className="page-label">
                PRODUCTIVITY
              </span>

              <h1>Analytics</h1>

              <p>
                See how you're doing with your tasks.
              </p>
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

                <h2>Task Completion</h2>

                <p>
                  {completedTasks} of {totalTasks} tasks completed
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

        {activePage === "goals" && (
          <section className="dashboard-page">
            <div className="dashboard-page-heading">
              <div className="page-icon">
                <Target size={28} />
              </div>

              <span className="page-label">PERSONAL GOALS</span>

              <h1>My Goals</h1>

              <p>
                Set a goal and track your progress.
              </p>
            </div>

            <div className="settings-list">
              <div className="settings-item">
                <div>
                  <h3>Daily Goal</h3>

                  <p>
                    Complete tasks to reach your daily goal.
                  </p>
                </div>

                <span className="settings-status">
                  {completedTasks}/{goalTarget}
                </span>
              </div>

              <div className="progress-big-card">
                <Target size={35} />

                <h2>
                  {goal || "Set your personal goal"}
                </h2>

                <p>
                  {goalProgress}% completed
                </p>

                <div
                  style={{
                    width: "80%",
                    height: "10px",
                    borderRadius: "20px",
                    background: "#eee4da",
                    overflow: "hidden",
                    marginTop: "18px",
                  }}
                >
                  <div
                    style={{
                      width: `${goalProgress}%`,
                      height: "100%",
                      borderRadius: "20px",
                      background: "#e98b27",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>

                <input
                  type="text"
                  value={goal}
                  onChange={(e) =>
                    setGoal(e.target.value)
                  }
                  placeholder="Enter your goal"
                  style={{
                    width: "80%",
                    marginTop: "20px",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    border: "1px solid #eee4da",
                    outline: "none",
                    fontFamily: "Poppins, sans-serif",
                  }}
                />

                <select
                  value={goalTarget}
                  onChange={(e) =>
                    setGoalTarget(Number(e.target.value))
                  }
                  style={{
                    width: "80%",
                    marginTop: "10px",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    border: "1px solid #eee4da",
                    outline: "none",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <option value={3}>3 tasks</option>
                  <option value={5}>5 tasks</option>
                  <option value={7}>7 tasks</option>
                  <option value={10}>10 tasks</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {activePage === "settings" && (
          <section className="dashboard-page">
            <div className="dashboard-page-heading">
              <div className="page-icon">
                <Settings size={28} />
              </div>

              <span className="page-label">
                PREFERENCES
              </span>

              <h1>Settings</h1>

              <p>
                Manage your FitUp dashboard preferences.
              </p>
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

