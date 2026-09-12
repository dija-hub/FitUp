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
  Dumbbell,
  Tag,
  Trophy,
  Star,
} from "lucide-react";

import { supabase } from "./utils/supabase";
import "./Dashboard.css";

const FOCUS_DURATIONS = [15, 25, 45, 60]; // minutes
const BREAK_MINUTES = 5;
const TOTAL_STARS = 6;

function Dashboard({
  darkMode,
  setShowDashboard,
  setIsLoggedIn,
  activePage,
  setActivePage,
}) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("Study");

  const [focusMinutes, setFocusMinutes] = useState(25);
  const [timerMode, setTimerMode] = useState("focus"); // "focus" | "break"
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Study");

  // GOALS PAGE STATE
  const [exercises, setExercises] = useState([
    { id: 1, name: "Squats", sets: 3, reps: "12" },
    { id: 2, name: "Push Ups", sets: 3, reps: "10" },
    { id: 3, name: "Plank", sets: 3, reps: "30s" },
  ]);

  const [categories, setCategories] = useState([
    { id: 1, emoji: "📚", name: "Study" },
    { id: 2, emoji: "💪", name: "Fitness" },
    { id: 3, emoji: "🎨", name: "Creative" },
  ]);

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const earnedStars = Math.min(completedTasks, TOTAL_STARS);

  // TIMER
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          if (timerMode === "focus") {
            // focus session done → auto-switch to break
            setTimerMode("break");
            return BREAK_MINUTES * 60;
          } else {
            // break done → back to focus, wait for user to start
            setTimerMode("focus");
            setTimerRunning(false);
            return focusMinutes * 60;
          }
        }

        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timerMode, focusMinutes]);

  // TASK FUNCTIONS
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

  // TIMER FUNCTIONS
  const toggleTimer = () => {
    setTimerRunning((current) => !current);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerMode("focus");
    setTimerSeconds(focusMinutes * 60);
  };

  const selectFocusDuration = (minutes) => {
    if (timerRunning) return; // don't allow changing mid-session
    setFocusMinutes(minutes);
    setTimerMode("focus");
    setTimerSeconds(minutes * 60);
  };

  const minutes = Math.floor(timerSeconds / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (timerSeconds % 60)
    .toString()
    .padStart(2, "0");

  // GOALS PAGE FUNCTIONS
  const addExercise = () => {
    const name = window.prompt("Exercise name:");
    if (!name || !name.trim()) return;

    const sets = window.prompt("Sets:", "3");
    const reps = window.prompt("Reps (e.g. 12 or 30s):", "12");

    setExercises((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.trim(),
        sets: sets || "3",
        reps: reps || "12",
      },
    ]);
  };

  const deleteExercise = (id) => {
    setExercises((current) => current.filter((e) => e.id !== id));
  };

  const addCategory = () => {
    const name = window.prompt("Category name:");
    if (!name || !name.trim()) return;

    const emoji = window.prompt("Emoji (optional):", "🏷️");

    setCategories((current) => [
      ...current,
      {
        id: Date.now(),
        emoji: emoji || "🏷️",
        name: name.trim(),
      },
    ]);
  };

  return (
    <div
      className={`dashboard ${
        darkMode ? "dashboard-dark" : ""
      }`}
    >
      <main className="dashboard-content">

        {activePage === "overview" && (
          <>
            <div className="welcome-box">
              <h1>Let's make today productive.</h1>

              <p>
                Stay consistent and keep moving forward.
              </p>
            </div>

            {/* STATS */}
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

            {/* MAIN GRID */}
            <div className="dashboard-grid">

              {/* LEFT */}
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

                {/* TASKS */}
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
                      <button onClick={clearCompleted}>
                        Clear completed
                        <Trash2 size={15} />
                      </button>
                    )}

                  </div>

                </section>

              </div>

              {/* RIGHT */}
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
                        <strong>
                          {progress}%
                        </strong>
                      </div>
                    </div>

                    <div className="completion-text">

                      <strong>
                        {completedTasks} of {totalTasks} tasks
                      </strong>

                      <span>
                        completed
                      </span>

                    </div>

                  </div>

                </section>

              </div>

            </div>
          </>
        )}

        {/* ================= FOCUS ================= */}
        {activePage === "focus" && (
          <section className="dashboard-page">

            <div className="dashboard-page-heading">

              <h1>Focus Timer</h1>

              <p>
                {timerMode === "focus"
                  ? "Stay focused and work without distractions."
                  : "Take a short break — you've earned it."}
              </p>

            </div>

            <div className="progress-big-card">

              <div className="timer-header">

                <div>
                  <Clock size={20} />

                  <strong>
                    {timerMode === "focus" ? "Pomodoro Timer" : "Break Time"}
                  </strong>
                </div>

                <span className={timerMode === "break" ? "break-badge" : ""}>
                  {timerMode === "focus"
                    ? `${focusMinutes} min focus`
                    : `${BREAK_MINUTES} min break`}
                </span>

              </div>

              {timerMode === "focus" && (
                <div className="duration-select">
                  {FOCUS_DURATIONS.map((min) => (
                    <button
                      key={min}
                      className={`duration-btn ${
                        focusMinutes === min ? "active" : ""
                      }`}
                      disabled={timerRunning}
                      onClick={() => selectFocusDuration(min)}
                    >
                      {min}m
                    </button>
                  ))}
                </div>
              )}

              <div
                className={`timer-display ${
                  timerMode === "break" ? "break-mode" : ""
                }`}
              >
                {minutes}:{seconds}
              </div>

              <div className="timer-controls">

                <button
                  className={`timer-start ${
                    timerMode === "break" ? "break-start" : ""
                  }`}
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
        )}

        {/* ================= GOALS ================= */}
        {activePage === "goals" && (
          <section className="dashboard-page">

            <div className="dashboard-page-heading">
              <h1>Goals</h1>
              <p>Track workouts, organize categories, and celebrate wins.</p>
            </div>

            <div className="goals-grid">

              {/* WORKOUT TRACKER */}
              <div className="feature-card">

                <div className="feature-card-header">
                  <div className="feature-icon orange">
                    <Dumbbell size={24} />
                  </div>

                  <div>
                    <h2>Workout Tracker</h2>
                    <p>Track exercises, sets and reps</p>
                  </div>
                </div>

                <div className="exercise-list">
                  {exercises.map((exercise) => (
                    <div className="exercise-item" key={exercise.id}>
                      <span className="exercise-name">{exercise.name}</span>

                      <div className="exercise-right">
                        <span className="exercise-sets">
                          {exercise.sets} × {exercise.reps}
                        </span>

                        <button
                          className="exercise-delete"
                          onClick={() => deleteExercise(exercise.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="feature-add-btn" onClick={addExercise}>
                  <Plus size={18} />
                  Add Exercise
                </button>

              </div>

              {/* CUSTOM CATEGORIES */}
              <div className="feature-card">

                <div className="feature-card-header">
                  <div className="feature-icon yellow">
                    <Tag size={24} />
                  </div>

                  <div>
                    <h2>Custom Categories</h2>
                    <p>User creates their own categories</p>
                  </div>
                </div>

                <div className="category-chips">
                  {categories.map((cat) => (
                    <span className="category-chip" key={cat.id}>
                      {cat.emoji} {cat.name}
                    </span>
                  ))}
                </div>

                <button className="feature-add-btn" onClick={addCategory}>
                  <Plus size={18} />
                  Create Category
                </button>

              </div>

              {/* ACHIEVEMENTS */}
              <div className="feature-card">

                <div className="feature-card-header">
                  <div className="feature-icon gold">
                    <Trophy size={24} />
                  </div>

                  <div>
                    <h2>Achievements</h2>
                    <p>Keep completing goals to earn stars</p>
                  </div>
                </div>

                <div className="stars-row">
                  {Array.from({ length: TOTAL_STARS }).map((_, index) => (
                    <Star
                      key={index}
                      size={28}
                      className={index < earnedStars ? "star filled" : "star"}
                      fill={index < earnedStars ? "#ffb020" : "none"}
                    />
                  ))}
                </div>

              </div>

            </div>

          </section>
        )}

      </main>

      {/* EDIT MODAL */}
      {editingTask && (
        <div
          className="edit-overlay"
          onClick={() =>
            setEditingTask(null)
          }
        >
          <div
            className="edit-box"
            onClick={(e) =>
              e.stopPropagation()
            }
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

            <p>
              Choose category
            </p>

            <div className="edit-categories">

              {[
                "Study",
                "Personal",
                "Health",
                "Project",
              ].map((item) => (
                <button
                  key={item}
                  className={`edit-category ${
                    item.toLowerCase()
                  } ${
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