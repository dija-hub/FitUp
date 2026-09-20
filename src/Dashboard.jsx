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
  ListChecks,
} from "lucide-react";

import { supabase } from "./utils/supabase";
import "./Dashboard.css";

const COLOR_OPTIONS = [
  "#3b82f6", "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#14b8a6", "#06b6d4", "#6366f1",
  "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e",
  "#84cc16", "#10b981", "#0ea5e9", "#64748b",
  "#78716c", "#d946ef", "#f59e0b", "#059669",
  "#7c3aed", "#db2777", "#ca8a04", "#475569",
];

const DEFAULT_CATEGORIES = [
  { name: "Study", color: "#3b82f6" },
  { name: "Personal", color: "#a855f7" },
  { name: "Health", color: "#ef4444" },
  { name: "Project", color: "#f59e0b" },
];

const getDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

  
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const sessionRecordedRef = useRef(false);

  
  const [selectedFocusType, setSelectedFocusType] = useState(null);
  const [selectedFocusId, setSelectedFocusId] = useState(null);
  const [focusTaskDropdownOpen, setFocusTaskDropdownOpen] = useState(false);

  const [focusSessions, setFocusSessions] = useState([]);
  const [lastCompletedSession, setLastCompletedSession] = useState(null);

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Study");

  
  const [exercises, setExercises] = useState([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseSets, setExerciseSets] = useState("3");
  const [exerciseReps, setExerciseReps] = useState("12");
  const [exerciseCategory, setExerciseCategory] = useState("Strength");
  const [selectedExercise, setSelectedExercise] = useState(null);

  
  const [milestones, setMilestones] = useState([]);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestoneText, setMilestoneText] = useState("");

  
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryColor, setCategoryColor] = useState("#94a3b8");
  const [categoryName, setCategoryName] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  const allCategories = [
    ...DEFAULT_CATEGORIES,
    ...categories.map((c) => ({ name: c.name, color: c.color })),
  ];

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const milestonesDone = milestones.filter((m) => m.done).length;
  const milestoneProgress =
    milestones.length === 0
      ? 0
      : Math.round((milestonesDone / milestones.length) * 100);

  const startOfWeek = new Date();
  const currentDay = startOfWeek.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  startOfWeek.setDate(startOfWeek.getDate() + mondayOffset);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    const dateKey = getDateKey(date);
    const dayTasks = tasks.filter(
      (task) => (task.date || getDateKey()) === dateKey
    );
    const isCompleted = dayTasks.length > 0 && dayTasks.every((task) => task.completed);

    return {
      date,
      dateKey,
      label: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
      isToday: dateKey === getDateKey(),
      hasTasks: dayTasks.length > 0,
      isCompleted,
    };
  });

  const completedDays = weekDays.filter((day) => day.isCompleted).length;

  const todayIndex = weekDays.findIndex((day) => day.isToday);

  const currentStreak = (() => {
    let streak = 0;

    for (let index = todayIndex; index >= 0; index -= 1) {
      if (!weekDays[index].isCompleted) break;
      streak += 1;
    }

    return streak;
  })();

  
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("fitup_tasks");
      const savedExercises = localStorage.getItem("fitup_exercises");
      const savedMilestones = localStorage.getItem("fitup_milestones");
      const savedCategories = localStorage.getItem("fitup_categories");
      const savedFocusSessions = localStorage.getItem("fitup_focus_sessions");

      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedExercises) setExercises(JSON.parse(savedExercises));
      if (savedMilestones) setMilestones(JSON.parse(savedMilestones));
      if (savedCategories) setCategories(JSON.parse(savedCategories));
      if (savedFocusSessions) setFocusSessions(JSON.parse(savedFocusSessions));
    } catch (err) {
      console.error("Failed to load saved data:", err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fitup_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("fitup_exercises", JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem("fitup_milestones", JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem("fitup_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("fitup_focus_sessions", JSON.stringify(focusSessions));
  }, [focusSessions]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleFocusTaskOutside = (e) => {
      if (!e.target.closest(".focus-task-dropdown")) {
        setFocusTaskDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleFocusTaskOutside);
    return () =>
      document.removeEventListener("mousedown", handleFocusTaskOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(e.target)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  
  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
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
      { id: Date.now(), title: newTask.trim(), category, completed: false, date: getDateKey() },
    ]);

    setNewTask("");
  };

  const clearCompleted = () => {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed));
  };

  const selectTaskCategory = (name) => {
    setCategory(name);
    setTaskCategoryOpen(false);
  };

  const getCategoryColor = (name) => {
    const found = allCategories.find((c) => c.name === name);
    return found ? found.color : "#94a3b8";
  };

  const getCategoryClass = (name) => {
    const known = ["study", "personal", "health", "project"];
    return known.includes(name.toLowerCase()) ? name.toLowerCase() : "custom";
  };

  
  const unfinishedTasks = tasks.filter((task) => !task.completed);
  const unfinishedExercises = exercises.filter((ex) => !ex.completed);

  const selectedFocusTask =
    selectedFocusType === "task"
      ? tasks.find((task) => task.id === selectedFocusId)
      : null;

  const selectedFocusExercise =
    selectedFocusType === "exercise"
      ? exercises.find((ex) => ex.id === selectedFocusId)
      : null;

  const selectedFocusLabel =
    selectedFocusTask?.title || selectedFocusExercise?.name || null;

  const selectFocusTarget = (type, id) => {
    setSelectedFocusType(type);
    setSelectedFocusId(id);
    setFocusTaskDropdownOpen(false);
    setTimerRunning(false);
    setTimerSeconds(0);
    sessionRecordedRef.current = false;
    setLastCompletedSession(null);
  };

  const startTimer = () => {
    if (!selectedFocusLabel) return;

    if (timerSeconds === 0) {
      sessionRecordedRef.current = false;
    }

    setTimerRunning(true);
    setLastCompletedSession(null);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
  };

  const finishTimer = () => {
    if (!selectedFocusLabel || timerSeconds === 0 || sessionRecordedRef.current) {
      return;
    }

    sessionRecordedRef.current = true;
    setTimerRunning(false);

    const durationMinutes = Math.floor(timerSeconds / 60);
    const session = {
      id: Date.now(),
      taskTitle: selectedFocusLabel,
      duration: durationMinutes,
      durationSeconds: timerSeconds,
      date: getDateKey(),
      completedAt: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setFocusSessions((current) => [session, ...current]);
    setLastCompletedSession(session);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
    sessionRecordedRef.current = false;
    setLastCompletedSession(null);
  };

  const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, "0");
  const seconds = (timerSeconds % 60).toString().padStart(2, "0");

  const formatSessionDuration = (totalSeconds = 0) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;

    const sessionMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return remainingSeconds === 0
      ? `${sessionMinutes}m`
      : `${sessionMinutes}m ${remainingSeconds}s`;
  };

  const todayFocusSessions = focusSessions.filter(
    (session) => session.date === getDateKey()
  );

  const todayFocusMinutes = todayFocusSessions.reduce(
    (total, session) => total + session.duration,
    0
  );

  const focusStreak = currentStreak;

  
  const EXERCISE_SUGGESTIONS = {
    Strength: [
      { name: "Push Ups", sets: "3", reps: "10" },
      { name: "Squats", sets: "3", reps: "12" },
      { name: "Lunges", sets: "3", reps: "10 each" },
      { name: "Bicep Curls", sets: "3", reps: "12" },
      { name: "Shoulder Press", sets: "3", reps: "10" },
    ],
    Cardio: [
      { name: "Jumping Jacks", sets: "3", reps: "30s" },
      { name: "High Knees", sets: "3", reps: "30s" },
      { name: "Burpees", sets: "3", reps: "10" },
      { name: "Mountain Climbers", sets: "3", reps: "30s" },
      { name: "Jogging", sets: "1", reps: "20 min" },
    ],
    Core: [
      { name: "Plank", sets: "3", reps: "30s" },
      { name: "Crunches", sets: "3", reps: "15" },
      { name: "Leg Raises", sets: "3", reps: "12" },
      { name: "Russian Twists", sets: "3", reps: "12 each" },
      { name: "Bicycle Crunches", sets: "3", reps: "15 each" },
    ],
    Flexibility: [
      { name: "Hamstring Stretch", sets: "2", reps: "30s" },
      { name: "Quad Stretch", sets: "2", reps: "30s each" },
      { name: "Shoulder Stretch", sets: "2", reps: "30s each" },
      { name: "Hip Flexor Stretch", sets: "2", reps: "30s each" },
      { name: "Full Body Stretch", sets: "1", reps: "10 min" },
    ],
  };

  const selectSuggestedExercise = (suggestion) => {
    setSelectedExercise(suggestion);
    setExerciseSets(suggestion.sets);
    setExerciseReps(suggestion.reps);
  };

  const addSelectedExercise = () => {
    if (!selectedExercise) return;

    setExercises((current) => [
      ...current,
      {
        id: Date.now() + Math.random(),
        name: selectedExercise.name,
        sets: exerciseSets.trim() || selectedExercise.sets,
        reps: exerciseReps.trim() || selectedExercise.reps,
        completed: false,
      },
    ]);

    setSelectedExercise(null);
    setExerciseSets("3");
    setExerciseReps("12");
    setExerciseCategory("Strength");
    setShowExerciseForm(false);
  };

  const cancelExerciseForm = () => {
    setSelectedExercise(null);
    setExerciseSets("3");
    setExerciseReps("12");
    setExerciseCategory("Strength");
    setShowExerciseForm(false);
  };

  const toggleExercise = (id) => {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === id
          ? { ...exercise, completed: !exercise.completed }
          : exercise
      )
    );
  };

  const deleteExercise = (id) => {
    setExercises((current) => current.filter((e) => e.id !== id));
  };

  const getExerciseMetricLabel = (value) => {
    const text = String(value).toLowerCase().trim();
    return /(s|sec|secs|min|mins|minute|minutes|hour|hours)$/.test(text)
      ? "time"
      : "reps";
  };

  
  const addMilestone = () => {
    if (!milestoneText.trim()) return;

    setMilestones((current) => [
      ...current,
      { id: Date.now(), text: milestoneText.trim(), done: false },
    ]);

    setMilestoneText("");
    setShowMilestoneForm(false);
  };

  const cancelMilestoneForm = () => {
    setMilestoneText("");
    setShowMilestoneForm(false);
  };

  const toggleMilestone = (id) => {
    setMilestones((current) =>
      current.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );
  };

  const deleteMilestone = (id) => {
    setMilestones((current) => current.filter((m) => m.id !== id));
  };


  const addCategory = () => {
    if (!categoryName.trim()) return;

    setCategories((current) => [
      ...current,
      { id: Date.now(), color: categoryColor, name: categoryName.trim() },
    ]);

    setCategoryColor("#94a3b8");
    setCategoryName("");
    setShowCategoryForm(false);
    setShowColorPicker(false);
  };

  const cancelCategoryForm = () => {
    setCategoryColor("#94a3b8");
    setCategoryName("");
    setShowCategoryForm(false);
    setShowColorPicker(false);
  };

  const deleteCategory = (id) => {
    setCategories((current) => current.filter((c) => c.id !== id));
  };

  const selectColor = (color) => {
    setCategoryColor(color);
    setShowColorPicker(false);
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
                          <span
                            className="custom-select-dot"
                            style={{ backgroundColor: getCategoryColor(category) }}
                          />
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
                              <span
                                className="custom-select-dot"
                                style={{ backgroundColor: cat.color }}
                              />
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
                            <span
                              className="category-dot"
                              style={{
                                backgroundColor: getCategoryColor(task.category),
                              }}
                            />
                            {task.category}
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
                          <span
                            className="category-chip-dot"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span style={{ color: cat.color, fontWeight: 600 }}>
                            {cat.name}
                          </span>
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

                      <div className="color-picker-wrapper" ref={colorPickerRef}>

                        <div className="inline-form-row">

                          <button
                            type="button"
                            className="color-picker-trigger"
                            onClick={() => setShowColorPicker((c) => !c)}
                          >
                            <span
                              className="color-picker-swatch"
                              style={{ backgroundColor: categoryColor }}
                            />
                            <ChevronDown size={16} />
                          </button>

                          <input
                            type="text"
                            className="inline-form-input"
                            placeholder="Category name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            autoFocus
                          />
                        </div>

                        {showColorPicker && (
                          <div className="color-picker-dropdown">
                            {COLOR_OPTIONS.map((c) => (
                              <button
                                type="button"
                                key={c}
                                className={`color-picker-option ${
                                  categoryColor === c ? "selected" : ""
                                }`}
                                style={{ backgroundColor: c }}
                                onClick={() => selectColor(c)}
                              />
                            ))}
                          </div>
                        )}

                      </div>

                      <div className="inline-form-actions">
                        <button
                          className="inline-form-cancel"
                          onClick={cancelCategoryForm}
                        >
                          <X size={16} />
                          Cancel
                        </button>

                        <button className="inline-form-save" onClick={addCategory}>
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
              <p>Choose a task, start the stopwatch, and focus at your own pace.</p>
            </div>

            <div className="focus-main-card progress-big-card">
              <div className="timer-header">
                <div>
                  <Clock size={20} />
                  <strong>Focus Session</strong>
                </div>

                <span>{selectedFocusLabel || "Choose a task"}</span>
              </div>

              <div className="timer-display">
                {minutes}:{seconds}
              </div>

              <p className="focus-helper-text">
                {timerRunning
                  ? "Stay focused. One task at a time."
                  : !selectedFocusLabel
                    ? "Choose a task or exercise before starting your session."
                    : timerSeconds === 0
                      ? "Press Start Focus to begin."
                      : "Pause or finish your session when you are done."}
              </p>

              <div className="timer-controls">
                {timerRunning ? (
                  <button className="timer-start" onClick={pauseTimer}>
                    Pause
                  </button>
                ) : (
                  <button
                    className="timer-start"
                    onClick={startTimer}
                    disabled={!selectedFocusLabel || sessionRecordedRef.current}
                  >
                    <Play size={18} />
                    Start Focus
                  </button>
                )}

                <button
                  className="timer-finish"
                  onClick={finishTimer}
                  disabled={!selectedFocusLabel || timerSeconds === 0 || sessionRecordedRef.current}
                >
                  <Check size={18} />
                  Finish
                </button>

                <button className="timer-reset" onClick={resetTimer}>
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>


            <div className="focus-task-card">
              <div className="focus-task-top focus-task-select-heading">
                <div>
                  <span className="focus-eyebrow">WHAT ARE YOU WORKING ON?</span>
                  <h2>Choose a task or exercise</h2>
                </div>
              </div>

              {unfinishedTasks.length > 0 || unfinishedExercises.length > 0 ? (
                <div className="focus-task-dropdown">
                  <button
                    type="button"
                    className={`focus-task-trigger ${
                      focusTaskDropdownOpen ? "open" : ""
                    }`}
                    onClick={() =>
                      setFocusTaskDropdownOpen((current) => !current)
                    }
                    disabled={timerRunning}
                  >
                    <span>{selectedFocusLabel || "Select a task or exercise"}</span>

                    <ChevronDown
                      size={18}
                      className={focusTaskDropdownOpen ? "rotated" : ""}
                    />
                  </button>

                  {focusTaskDropdownOpen && (
                    <div className="focus-task-menu">

                      {unfinishedTasks.length > 0 && (
                        <>
                          <div className="focus-task-menu-title">Tasks</div>

                          {unfinishedTasks.map((task) => (
                            <button
                              type="button"
                              key={`task-${task.id}`}
                              className={`focus-task-option ${
                                selectedFocusType === "task" &&
                                selectedFocusId === task.id
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => selectFocusTarget("task", task.id)}
                            >
                              <span className="focus-task-option-check">
                                {selectedFocusType === "task" &&
                                  selectedFocusId === task.id && (
                                    <Check size={14} />
                                  )}
                              </span>

                              <span className="focus-task-option-name">
                                {task.title}
                              </span>
                            </button>
                          ))}
                        </>
                      )}

                      {unfinishedExercises.length > 0 && (
                        <>
                          <div className="focus-task-menu-title">Exercises</div>

                          {unfinishedExercises.map((ex) => (
                            <button
                              type="button"
                              key={`exercise-${ex.id}`}
                              className={`focus-task-option ${
                                selectedFocusType === "exercise" &&
                                selectedFocusId === ex.id
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => selectFocusTarget("exercise", ex.id)}
                            >
                              <span className="focus-task-option-check">
                                {selectedFocusType === "exercise" &&
                                  selectedFocusId === ex.id && (
                                    <Check size={14} />
                                  )}
                              </span>

                              <span className="focus-task-option-name">
                                {ex.name} ({ex.sets} × {ex.reps})
                              </span>
                            </button>
                          ))}
                        </>
                      )}

                    </div>
                  )}
                </div>
              ) : (
                <div className="focus-no-tasks">
                  <p>No unfinished tasks or exercises yet.</p>
                  <span>
                    Add a task from Overview or an exercise below to start a
                    focus session.
                  </span>
                </div>
              )}
            </div>

            {lastCompletedSession && (
              <div className="focus-complete-card">
                <div className="focus-complete-icon">
                  <Check size={20} />
                </div>
                <div>
                  <strong>Focus session completed</strong>
                  <p>
                    Task: {lastCompletedSession.taskTitle} · Time: {formatSessionDuration(lastCompletedSession.durationSeconds)}
                  </p>
                </div>
              </div>
            )}

            <div className="focus-bottom-grid">
              <div className="focus-stat-card">
                <div className="focus-card-heading">
                  <div>
                    <span className="focus-eyebrow">TODAY'S FOCUS</span>
                    <h2>Focus stats</h2>
                  </div>
                  <Clock size={20} />
                </div>

                <div className="focus-stat-values">
                  <div>
                    <strong>{todayFocusSessions.length}</strong>
                    <span>Sessions</span>
                  </div>
                  <div>
                    <strong>{todayFocusMinutes} min</strong>
                    <span>Focused</span>
                  </div>
                </div>
              </div>

              <div className="focus-stat-card">
                <div className="focus-card-heading">
                  <div>
                    <span className="focus-eyebrow">RECENT SESSIONS</span>
                    <h2>Your latest focus</h2>
                  </div>
                </div>

                {focusSessions.length === 0 ? (
                  <div className="focus-empty-sessions">
                    <p>No completed sessions yet.</p>
                  </div>
                ) : (
                  <div className="focus-session-list">
                    {focusSessions.slice(0, 5).map((session) => (
                      <div className="focus-session-item" key={session.id}>
                        <span className="focus-session-check">
                          <Check size={14} />
                        </span>
                        <div>
                          <strong>{session.taskTitle}</strong>
                          <small>{session.completedAt}</small>
                        </div>
                        <span className="focus-session-duration">
                          {formatSessionDuration(session.durationSeconds || session.duration * 60)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="goals-layout">

              <div className="goals-left">

              
              <div className="feature-card">
                <div className="feature-card-header">
                  <div className="feature-icon orange">
                    <Dumbbell size={24} />
                  </div>
                  <div>
                    <h2>Workout Tracker</h2>
                    <p>Choose an exercise and build your routine</p>
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
                      <div
                        className={`exercise-item ${
                          exercise.completed ? "exercise-completed" : ""
                        }`}
                        key={exercise.id}
                      >
                        <button
                          type="button"
                          className={`exercise-check ${
                            exercise.completed ? "checked" : ""
                          }`}
                          onClick={() => toggleExercise(exercise.id)}
                          aria-label={
                            exercise.completed
                              ? `Mark ${exercise.name} as incomplete`
                              : `Mark ${exercise.name} as complete`
                          }
                        >
                          {exercise.completed && <Check size={13} />}
                        </button>

                        <span className="exercise-name">{exercise.name}</span>

                        <div className="exercise-right">
                          <div className="exercise-metrics">
                            <div className="exercise-metric">
                              <strong>{exercise.sets}</strong>
                              <small>sets</small>
                            </div>

                            <span className="exercise-multiply">×</span>

                            <div className="exercise-metric">
                              <strong>{exercise.reps}</strong>
                              <small>{getExerciseMetricLabel(exercise.reps)}</small>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="exercise-delete"
                            onClick={() => deleteExercise(exercise.id)}
                            aria-label={`Delete ${exercise.name}`}
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
                    <div className="suggestion-categories">
                      {Object.keys(EXERCISE_SUGGESTIONS).map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`suggestion-category ${
                            exerciseCategory === type ? "active" : ""
                          }`}
                          onClick={() => setExerciseCategory(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    <div className="suggestion-list">
                      {EXERCISE_SUGGESTIONS[exerciseCategory].map((suggestion) => (
                        <button
                          type="button"
                          key={suggestion.name}
                          className={`suggestion-item ${
                            selectedExercise?.name === suggestion.name ? "selected" : ""
                          }`}
                          onClick={() => selectSuggestedExercise(suggestion)}
                        >
                          <span>
                            <strong>{suggestion.name}</strong>
                            <small>Suggested: {suggestion.sets} × {suggestion.reps}</small>
                          </span>
                          <Plus size={17} />
                        </button>
                      ))}
                    </div>

                    {selectedExercise && (
                      <>
                        <div className="selected-exercise">
                          <span>Selected: <strong>{selectedExercise.name}</strong></span>
                        </div>

                        <div className="inline-form-row">
                          <input
                            type="text"
                            className="inline-form-input"
                            placeholder="Sets"
                            value={exerciseSets}
                            onChange={(e) => setExerciseSets(e.target.value)}
                          />
                          <input
                            type="text"
                            className="inline-form-input"
                            placeholder="Reps / time"
                            value={exerciseReps}
                            onChange={(e) => setExerciseReps(e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    <div className="inline-form-actions">
                      <button className="inline-form-cancel" onClick={cancelExerciseForm}>
                        <X size={16} />
                        Cancel
                      </button>

                      {selectedExercise && (
                        <button className="inline-form-save" onClick={addSelectedExercise}>
                          <Check size={16} />
                          Add Exercise
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    className="feature-add-btn"
                    onClick={() => setShowExerciseForm(true)}
                  >
                    <Plus size={18} />
                    Choose Exercise
                  </button>
                )}
              </div>

              </div>

              <div className="goals-right">

              
              <div className="feature-card">

                <div className="feature-card-header">
                  <div className="feature-icon purple">
                    <ListChecks size={24} />
                  </div>
                  <div>
                    <h2>Milestones</h2>
                    <p>Break big goals into small wins</p>
                  </div>
                </div>

                {milestones.length > 0 && (
                  <div className="mini-progress">
                    <div className="mini-progress-track">
                      <div
                        className="mini-progress-fill"
                        style={{ width: `${milestoneProgress}%` }}
                      />
                    </div>
                    <span>
                      {milestonesDone} of {milestones.length} done
                    </span>
                  </div>
                )}

                {milestones.length === 0 && !showMilestoneForm && (
                  <div className="feature-empty">
                    <p>No milestones yet.</p>
                  </div>
                )}

                {milestones.length > 0 && (
                  <div className="milestone-list">
                    {milestones.map((m) => (
                      <div
                        className={`milestone-item ${m.done ? "milestone-done" : ""}`}
                        key={m.id}
                      >
                        <button
                          className={`milestone-check ${m.done ? "checked" : ""}`}
                          onClick={() => toggleMilestone(m.id)}
                        >
                          {m.done && <Check size={14} />}
                        </button>

                        <span className="milestone-text">{m.text}</span>

                        <button
                          className="exercise-delete"
                          onClick={() => deleteMilestone(m.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showMilestoneForm ? (
                  <div className="inline-form">
                    <input
                      type="text"
                      className="inline-form-input"
                      placeholder="e.g. Run 5km without stopping"
                      value={milestoneText}
                      onChange={(e) => setMilestoneText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addMilestone();
                      }}
                      autoFocus
                    />

                    <div className="inline-form-actions">
                      <button className="inline-form-cancel" onClick={cancelMilestoneForm}>
                        <X size={16} />
                        Cancel
                      </button>

                      <button className="inline-form-save" onClick={addMilestone}>
                        <Check size={16} />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="feature-add-btn"
                    onClick={() => setShowMilestoneForm(true)}
                  >
                    <Plus size={18} />
                    Add Milestone
                  </button>
                )}

              </div>



              </div>
            </div>

            <div className="goals-full-width">
              
              <div className="feature-card weekly-consistency-card">
                <div className="weekly-consistency-top">
                  <span className="weekly-label">CONSISTENCY</span>
                  <strong className="weekly-count">{completedDays} / 7</strong>
                </div>

                <div className="weekly-heading">
                  <h2>This week</h2>
                  <p>Complete all your tasks for a day to mark it complete.</p>
                </div>

                <div className="weekly-days">
                  {weekDays.map((day) => (
                    <div className="weekly-day" key={day.dateKey}>
                      <span className="weekly-day-label">{day.label}</span>

                      <div
                        className={`weekly-day-circle ${
                          day.isCompleted
                            ? "completed"
                            : day.isToday
                              ? "today"
                              : ""
                        }`}
                        title={
                          day.isCompleted
                            ? "All tasks completed"
                            : day.hasTasks
                              ? "Tasks still remaining"
                              : "No tasks for this day"
                        }
                      >
                        {day.isCompleted ? <Check size={18} /> : day.isToday ? <span /> : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="weekly-status">
                  {completedDays === 7 ? (
                    <strong>✓ Week completed — amazing consistency!</strong>
                  ) : currentStreak > 0 ? (
                    <strong>{currentStreak} day streak — keep it going</strong>
                  ) : (
                    <strong>{completedDays} day completed — start today</strong>
                  )}
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
                  <span
                    className="edit-category-dot"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
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