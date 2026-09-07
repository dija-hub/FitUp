import { useEffect, useState } from "react";
import {
  Check,
  Plus,
  Trash2,
  Edit3,
  ListTodo,
  TrendingUp,
  Clock,
  CalendarDays,
  Play,
  RotateCcw,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard({
  darkMode,
  setShowDashboard,
  setIsLoggedIn,
}) {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Study React",
      category: "Study",
      completed: false,
    },
    {
      id: 2,
      title: "Read a book",
      category: "Personal",
      completed: true,
    },
    {
      id: 3,
      title: "Practice basketball",
      category: "Health",
      completed: false,
    },
    {
      id: 4,
      title: "Build ToDo App",
      category: "Project",
      completed: false,
    },
    {
      id: 5,
      title: "Morning Workout",
      category: "Health",
      completed: true,
    },
  ]);

  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("Study");

  const [time, setTime] = useState(new Date());

  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  /* ---------------- DATE / CLOCK ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- FOCUS TIMER ---------------- */

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

  /* ---------------- TASK DATA ---------------- */

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  /* ---------------- TASK FUNCTIONS ---------------- */

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

  const editTask = (id) => {
    const task = tasks.find((item) => item.id === id);

    if (!task) return;

    const updatedTitle = window.prompt(
      "Edit task",
      task.title
    );

    if (!updatedTitle || updatedTitle.trim() === "") {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === id
          ? {
              ...item,
              title: updatedTitle.trim(),
            }
          : item
      )
    );
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

  /* ---------------- TIMER ---------------- */

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

  /* ---------------- WEEKLY DATA ---------------- */

  const weeklyProgress = [
    { day: "Mon", value: 3 },
    { day: "Tue", value: 4 },
    { day: "Wed", value: 5 },
    { day: "Thu", value: 7 },
    { day: "Fri", value: 4 },
    { day: "Sat", value: 5 },
    { day: "Sun", value: 6 },
  ];

  const maxWeeklyValue = 7;

  /* ---------------- SIGN OUT ---------------- */

  const handleSignOut = async () => {
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

        {/* ================= TOP ================= */}

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
            <h1>
              Let's make today productive.
            </h1>

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

        {/* ================= STATS ================= */}

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

              <strong className="stat-number">
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

        {/* ================= MAIN GRID ================= */}

        <div className="dashboard-grid">

          {/* ================= LEFT ================= */}

          <div className="left-column">

            {/* ADD TASK */}

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

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >
                  <option>Study</option>
                  <option>Personal</option>
                  <option>Health</option>
                  <option>Project</option>
                </select>

                <button
                  className="add-button"
                  onClick={addTask}
                >
                  <Plus size={21} />
                  Add Task
                </button>

              </div>

            </section>

            {/* MY TASKS */}

            <section className="tasks-section">

              <div className="tasks-heading">

                <h2>My Tasks</h2>

                <span>
                  {totalTasks} tasks
                </span>

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
                        className={`category ${
                          task.category.toLowerCase()
                        }`}
                      >
                        {task.category}
                      </span>

                      <div className="task-actions">

                        <button
                          onClick={() =>
                            editTask(task.id)
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

          {/* ================= RIGHT ================= */}

          <div className="right-column">

            {/* WEEKLY PROGRESS */}

            <section className="weekly-section">

              <h2>Weekly Progress</h2>

              <div className="weekly-chart">

                {weeklyProgress.map((item) => (
                  <div
                    className="week-day"
                    key={item.day}
                  >

                    <div className="bar-container">

                      <div
                        className={`week-bar ${
                          item.day === "Thu"
                            ? "active-bar"
                            : ""
                        }`}
                        style={{
                          height: `${
                            (item.value /
                              maxWeeklyValue) *
                            100
                          }%`,
                        }}
                      />

                    </div>

                    <span>
                      {item.day}
                    </span>

                  </div>
                ))}

              </div>

              <div className="weekly-divider" />

              {/* PROGRESS */}

              <div className="completion-area">

                <div
                  className="progress-ring"
                  style={{
                    "--progress": `${progress}%`,
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

              {/* TIMER */}

              <div className="timer-card">

                <div className="timer-header">

                  <div>
                    <Clock size={20} />
                    <strong>
                      Focus Timer
                    </strong>
                  </div>

                  <span>
                    25 min focus
                  </span>

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

        {/* ================= FOOTER ================= */}

        <div className="dashboard-footer">

          <p>
            Keep showing up. Progress happens one day
            at a time.
          </p>

          <button onClick={handleSignOut}>
            Sign out
          </button>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;