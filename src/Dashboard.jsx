import { useEffect, useRef, useState } from "react";
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
  X,
  ChevronDown,
  Target,
  StickyNote,
} from "lucide-react";

import { supabase } from "./utils/supabase";
import "./Dashboard.css";

const FOCUS_DURATIONS = [15, 25, 45, 60]; 
const BREAK_MINUTES = 5;

const EMOJI_OPTIONS = [
  "📚", "💪", "🎨", "💻", "🧘", "🎵",
  "🍳", "🌱", "✈️", "💰", "🏠", "📝",
  "🎯", "❤️", "🧠", "⚽", "📷", "🛠️",
  "🎮", "🛒", "🐾", "🌟", "☕", "📖",
];

const DEFAULT_CATEGORIES = [
  { name: "Study", emoji: "📚" },
  { name: "Personal", emoji: "👤" },
  { name: "Health", emoji: "❤️" },
  { name: "Project", emoji: "📁" },
];

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
  const [taskCategoryOpen, setTaskCategoryOpen] = useState(false);
  const taskCategoryRef = useRef(null);

  const [focusMinutes, setFocusMinutes] = useState(25);
  const [timerMode, setTimerMode] = useState("focus"); // "focus" | "break"
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Study");

  // WORKOUT TRACKER STATE
  const [exercises, setExercises] = useState([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseSets, setExerciseSets] = useState("");
  const [exerciseReps, setExerciseReps] = useState("");

  // WEEKLY GOAL STATE
  const [weeklyGoal, setWeeklyGoal] = useState(4);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // NOTES STATE
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  // CUSTOM CATEGORIES STATE
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryEmoji, setCategoryEmoji] = useState("🏷️");
  const [categoryName, setCategoryName] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const allCategories = [
    ...DEFAULT_CATEGORIES,
    ...categories.map((c) => ({ name: c.name, emoji: c.emoji })),
  ];

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const goalProgress =
    weeklyGoal === 0
      ? 0
      : Math.min(100, Math.round((sessionsCompleted / weeklyGoal) * 100));

  // CLOSE TASK CATEGORY DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        taskCategoryRef.current &&
        !taskCategoryRef.current.contains(e.target)
      ) {
        setTaskCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          if (timerMode === "focus") {
            setTimerMode("break");
            return BREAK_MINUTES * 60;
          } else {
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

 
  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
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
          ? { ...item, title: editTitle.trim(), category: editCategory }
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

  const selectTaskCategory = (name) => {
    setCategory(name);
    setTaskCategoryOpen(false);
  };

  const getCategoryEmoji = (name) => {
    const found = allCategories.find((c) => c.name === name);
    return found ? found.emoji : "🏷️";
  };

  const getCategoryClass = (name) => {
    const known = ["study", "personal", "health", "project"];
    return known.includes(name.toLowerCase())
      ? name.toLowerCase()
      : "custom";
  };

  
  const toggleTimer = () => {
    setTimerRunning((current) => !current);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerMode("focus");
    setTimerSeconds(focusMinutes * 60);
  };

  const selectFocusDuration = (minutes) => {
    if (timerRunning) return;
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

  
  const addExercise = () => {
    if (!exerciseName.trim()) return;

    setExercises((current) => [
      ...current,
      {
        id: Date.now(),
        name: exerciseName.trim(),
        sets: exerciseSets.trim() || "3",
        reps: exerciseReps.trim() || "12",
      },
    ]);

    setExerciseName("");
    setExerciseSets("");
    setExerciseReps("");
    setShowExerciseForm(false);
  };

  const cancelExerciseForm = () => {
    setExerciseName("");
    setExerciseSets("");
    setExerciseReps("");
    setShowExerciseForm(false);
  };

  const deleteExercise = (id) => {
    setExercises((current) => current.filter((e) => e.id !== id));
  };

 
  const incrementSession = () => {
    setSessionsCompleted((current) => current + 1);
  };

  const resetSessions = () => {
    setSessionsCompleted(0);
  };

  const changeWeeklyGoal = (delta) => {
    setWeeklyGoal((current) => Math.max(1, current + delta));
  };

  
  const addNote = () => {
    if (!newNote.trim()) return;

    setNotes((current) => [
      ...current,
      { id: Date.now(), text: newNote.trim() },
    ]);

    setNewNote("");
  };

  const deleteNote = (id) => {
    setNotes((current) => current.filter((n) => n.id !== id));
  };

 
  const addCategory = () => {
    if (!categoryName.trim()) return;

    setCategories((current) => [
      ...current,
      {
        id: Date.now(),
        emoji: categoryEmoji,
        name: categoryName.trim(),
      },
    ]);

    setCategoryEmoji("🏷️");
    setCategoryName("");
    setShowCategoryForm(false);
    setShowEmojiPicker(false);
  };

  const cancelCategoryForm = () => {
    setCategoryEmoji("🏷️");
    setCategoryName("");
    setShowCategoryForm(false);
    setShowEmojiPicker(false);
  };

  const deleteCategory = (id) => {
    setCategories((current) => current.filter((c) => c.id !== id));
  };

  const selectEmoji = (emoji) => {
    setCategoryEmoji(emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className={`dashboard ${darkMode ? "dashboard-dark" : ""}`}>
      <main className="dashboard-content">

        {activePage === "overview" && (
          <>
            <div className="welcome-box">
              <h1>Let's make today productive.</h1>
              <p>Stay consistent and keep moving forward.</p>
            </div>

            
            <section className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon orange">
                  <ListTodo size={25} />
                </div>
                <div>
                  <span className="stat-title">All Tasks</span>
                  <strong className="stat-number orange-text">{totalTasks}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">
                  <Check size={25} />
                </div>
                <div>
                  <span className="stat-title">Done</span>
                  <strong className="stat-number green-text">{completedTasks}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon dark-icon">
                  <Clock size={25} />
                </div>
                <div>
                  <span className="stat-title">In Progress</span>
                  <strong className="stat-number dark-text">{pendingTasks}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon red-icon">
                  <CalendarDays size={25} />
                </div>
                <div>
                  <span className="stat-title">Pending</span>
                  <strong className="stat-number red-text">{pendingTasks}</strong>
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
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addTask();
                      }}
                      placeholder="What do you want to do?"
                    />

                    <div className="custom-select" ref={taskCategoryRef}>
                      <button
                        type="button"
                        className="custom-select-trigger"
                        onClick={() => setTaskCategoryOpen((c) => !c)}
                      >
                        <span className="custom-select-label">
                          <span className="custom-select-emoji">
                            {getCategoryEmoji(category)}
                          </span>
                          {category}
                        </span>

                        <ChevronDown
                          size={17}
                          className={`custom-select-chevron ${
                            taskCategoryOpen ? "open" : ""
                          }`}
                        />
                      </button>

                      {taskCategoryOpen && (
                        <div className="custom-select-dropdown">
                          {allCategories.map((cat) => (
                            <button
                              type="button"
                              key={cat.name}
                              className={`custom-select-option ${
                                category === cat.name ? "active" : ""
                              }`}
                              onClick={() => selectTaskCategory(cat.name)}
                            >
                              <span className="custom-select-emoji">
                                {cat.emoji}
                              </span>
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button className="add-button" onClick={addTask}>
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
                            task.completed ? "task-completed" : ""
                          }`}
                          key={task.id}
                        >
                          <button
                            className={`task-check ${
                              task.completed ? "checked" : ""
                            }`}
                            onClick={() => toggleTask(task.id)}
                          >
                            {task.completed && <Check size={16} />}
                          </button>

                          <div className="task-title">
                            <h3>{task.title}</h3>
                          </div>

                          <span
                            className={`category ${getCategoryClass(
                              task.category
                            )}`}
                          >
                            {getCategoryEmoji(task.category)} {task.category}
                          </span>

                          <div className="task-actions">
                            <button onClick={() => editTask(task)}>
                              <Edit3 size={17} />
                            </button>

                            <button onClick={() => deleteTask(task.id)}>
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

              
              <div className="right-column">

                <section className="weekly-section">
                  <h2>Today's Progress</h2>

                  <div className="completion-area">
                    <div
                      className="progress-ring"
                      style={{ "--progress": `${progress * 3.6}deg` }}
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

                
                <section className="categories-section">

                  <div className="categories-header">
                    <div className="feature-icon yellow small">
                      <Tag size={20} />
                    </div>

                    <div>
                      <h2>Custom Categories</h2>
                      <p>Create your own categories</p>
                    </div>
                  </div>

                  {categories.length === 0 && !showCategoryForm && (
                    <div className="feature-empty">
                      <p>No categories yet.</p>
                    </div>
                  )}

                  {categories.length > 0 && (
                    <div className="category-chips">
                      {categories.map((cat) => (
                        <span className="category-chip" key={cat.id}>
                          {cat.emoji} {cat.name}
                          <button
                            className="category-chip-delete"
                            onClick={() => deleteCategory(cat.id)}
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {showCategoryForm ? (
                    <div className="inline-form">

                      <div className="inline-form-row">

                        <div
                          className="emoji-picker-wrapper"
                          ref={emojiPickerRef}
                        >
                          <button
                            type="button"
                            className="emoji-picker-trigger"
                            onClick={() =>
                              setShowEmojiPicker((c) => !c)
                            }
                          >
                            <span className="emoji-picker-selected">
                              {categoryEmoji}
                            </span>
                            <ChevronDown size={16} />
                          </button>

                          {showEmojiPicker && (
                            <div className="emoji-picker-dropdown">
                              {EMOJI_OPTIONS.map((emoji) => (
                                <button
                                  type="button"
                                  key={emoji}
                                  className={`emoji-picker-option ${
                                    categoryEmoji === emoji ? "selected" : ""
                                  }`}
                                  onClick={() => selectEmoji(emoji)}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <input
                          type="text"
                          className="inline-form-input"
                          placeholder="Category name"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          autoFocus
                        />
                      </div>

                      <div className="inline-form-actions">
                        <button
                          className="inline-form-cancel"
                          onClick={cancelCategoryForm}
                        >
                          <X size={16} />
                          Cancel
                        </button>

                        <button
                          className="inline-form-save"
                          onClick={addCategory}
                        >
                          <Check size={16} />
                          Save
                        </button>
                      </div>

                    </div>
                  ) : (
                    <button
                      className="feature-add-btn"
                      onClick={() => setShowCategoryForm(true)}
                    >
                      <Plus size={18} />
                      Create Category
                    </button>
                  )}

                </section>

              </div>

            </div>
          </>
        )}

     
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
                  {timerRunning ? "Pause" : "Start"}
                </button>

                <button className="timer-reset" onClick={resetTimer}>
                  <RotateCcw size={18} />
                </button>
              </div>

            </div>

          </section>
        )}

    
        {activePage === "goals" && (
          <section className="dashboard-page">

            <div className="dashboard-page-heading">
              <h1>Goals</h1>
              <p>Track workouts, set weekly targets, and jot down notes.</p>
            </div>

            <div className="goals-grid">

              
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

                {exercises.length === 0 && !showExerciseForm && (
                  <div className="feature-empty">
                    <p>No exercises yet.</p>
                  </div>
                )}

                {exercises.length > 0 && (
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
                )}

                {showExerciseForm ? (
                  <div className="inline-form">

                    <input
                      type="text"
                      className="inline-form-input"
                      placeholder="Exercise name"
                      value={exerciseName}
                      onChange={(e) => setExerciseName(e.target.value)}
                      autoFocus
                    />

                    <div className="inline-form-row">
                      <input
                        type="text"
                        className="inline-form-input"
                        placeholder="Sets (e.g. 3)"
                        value={exerciseSets}
                        onChange={(e) => setExerciseSets(e.target.value)}
                      />

                      <input
                        type="text"
                        className="inline-form-input"
                        placeholder="Reps (e.g. 12 or 30s)"
                        value={exerciseReps}
                        onChange={(e) => setExerciseReps(e.target.value)}
                      />
                    </div>

                    <div className="inline-form-actions">
                      <button
                        className="inline-form-cancel"
                        onClick={cancelExerciseForm}
                      >
                        <X size={16} />
                        Cancel
                      </button>

                      <button className="inline-form-save" onClick={addExercise}>
                        <Check size={16} />
                        Save
                      </button>
                    </div>

                  </div>
                ) : (
                  <button
                    className="feature-add-btn"
                    onClick={() => setShowExerciseForm(true)}
                  >
                    <Plus size={18} />
                    Add Exercise
                  </button>
                )}

              </div>

              
              <div className="feature-card">

                <div className="feature-card-header">
                  <div className="feature-icon purple">
                    <Target size={24} />
                  </div>
                  <div>
                    <h2>Weekly Goal</h2>
                    <p>Set a target and track your sessions</p>
                  </div>
                </div>

                <div className="goal-tracker">

                  <div className="goal-bar-track">
                    <div
                      className="goal-bar-fill"
                      style={{ width: `${goalProgress}%` }}
                    />
                  </div>

                  <div className="goal-tracker-stats">
                    <strong>
                      {sessionsCompleted} / {weeklyGoal} sessions
                    </strong>
                    <span>{goalProgress}% complete</span>
                  </div>

                  <div className="goal-tracker-controls">

                    <div className="goal-target-adjust">
                      <span>Target</span>

                      <div className="goal-target-buttons">
                        <button onClick={() => changeWeeklyGoal(-1)}>−</button>
                        <strong>{weeklyGoal}</strong>
                        <button onClick={() => changeWeeklyGoal(1)}>+</button>
                      </div>
                    </div>

                    <div className="goal-session-buttons">
                      <button
                        className="feature-add-btn small"
                        onClick={incrementSession}
                      >
                        <Plus size={16} />
                        Log Session
                      </button>

                      <button
                        className="goal-reset-btn"
                        onClick={resetSessions}
                      >
                        <RotateCcw size={15} />
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              
              <div className="feature-card">

                <div className="feature-card-header">
                  <div className="feature-icon blue">
                    <StickyNote size={24} />
                  </div>
                  <div>
                    <h2>Progress Notes</h2>
                    <p>Jot down thoughts on your journey</p>
                  </div>
                </div>

                {notes.length === 0 && (
                  <div className="feature-empty">
                    <p>No notes yet.</p>
                  </div>
                )}

                {notes.length > 0 && (
                  <div className="notes-list">
                    {notes.map((note) => (
                      <div className="note-item" key={note.id}>
                        <span>{note.text}</span>

                        <button
                          className="exercise-delete"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="inline-form">
                  <input
                    type="text"
                    className="inline-form-input"
                    placeholder="Write a quick note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addNote();
                    }}
                  />

                  <button className="feature-add-btn" onClick={addNote}>
                    <Plus size={18} />
                    Add Note
                  </button>
                </div>

              </div>

            </div>

          </section>
        )}

      </main>

      
      {editingTask && (
        <div className="edit-overlay" onClick={() => setEditingTask(null)}>
          <div className="edit-box" onClick={(e) => e.stopPropagation()}>

            <h2>Edit Task</h2>

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task name"
            />

            <p>Choose category</p>

            <div className="edit-categories">
              {allCategories.map((item) => (
                <button
                  key={item.name}
                  className={`edit-category ${getCategoryClass(item.name)} ${
                    editCategory === item.name ? "selected" : ""
                  }`}
                  onClick={() => setEditCategory(item.name)}
                >
                  {item.emoji} {item.name}
                </button>
              ))}
            </div>

            <div className="edit-actions">
              <button
                className="cancel-edit"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </button>

              <button className="save-edit" onClick={saveEdit}>
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