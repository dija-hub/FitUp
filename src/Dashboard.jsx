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

  // FOCUS TIMER STATE (stopwatch: counts up from 0)
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Study");

  // WORKOUT TRACKER STATE
  const [exercises, setExercises] = useState([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseSets, setExerciseSets] = useState("3");
  const [exerciseReps, setExerciseReps] = useState("12");
  const [exerciseCategory, setExerciseCategory] = useState("Strength");
  const [selectedExercise, setSelectedExercise] = useState(null);


  // CUSTOM CATEGORIES STATE
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // CLOSE COLOR PICKER ON OUTSIDE CLICK
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

  // TIMER (stopwatch — counts up while running)
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  // TASK FUNCTIONS
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
      { id: Date.now(), title: newTask.trim(), category, completed: false },
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

  // TIMER FUNCTIONS
  const toggleTimer = () => {
    setTimerRunning((current) => !current);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
  };

  const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, "0");
  const seconds = (timerSeconds % 60).toString().padStart(2, "0");

  // WORKOUT TRACKER FUNCTIONS
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

  const deleteExercise = (id) => {
    setExercises((current) => current.filter((e) => e.id !== id));
  };

  const addSuggestionTask = (title) => {
    setTasks((currentTasks) => [
      ...currentTasks,
      { id: Date.now() + Math.random(), title, category: "Health", completed: false },
    ]);
  };

  // CUSTOM CATEGORIES FUNCTIONS
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

                      {/* Both the trigger button and the dropdown live inside
                          the same ref'd wrapper, so clicking a swatch counts
                          as an "inside" click and doesn't get closed by the
                          outside-click handler before onClick can fire. */}
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
              <p>Start the clock and stay with it as long as you like.</p>
            </div>

            <div className="progress-big-card">

              <div className="timer-header">
                <div>
                  <Clock size={20} />
                  <strong>Stopwatch</strong>
                </div>
              </div>

              <div className="timer-display">
                {minutes}:{seconds}
              </div>

              <div className="timer-controls">
                <button className="timer-start" onClick={toggleTimer}>
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
              <p>Build your workout routine with simple guided suggestions.</p>
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

              {/* DAILY SUGGESTIONS */}
              <div className="feature-card">
                <div className="feature-card-header">
                  <div className="feature-icon purple">
                    <Target size={24} />
                  </div>
                  <div>
                    <h2>Daily Suggestions</h2>
                    <p>Small actions to keep your fitness goal moving</p>
                  </div>
                </div>

                <div className="suggestion-list goal-suggestion-list">
                  <button
                    type="button"
                    className="suggestion-item"
                    onClick={() => addSuggestionTask("Walk for 20 minutes")}
                  >
                    <span>
                      <strong>20-minute walk</strong>
                      <small>Light cardio and movement</small>
                    </span>
                    <Plus size={17} />
                  </button>

                  <button
                    type="button"
                    className="suggestion-item"
                    onClick={() => addSuggestionTask("Do 10 minutes of stretching")}
                  >
                    <span>
                      <strong>10-minute stretch</strong>
                      <small>Improve mobility and recovery</small>
                    </span>
                    <Plus size={17} />
                  </button>

                  <button
                    type="button"
                    className="suggestion-item"
                    onClick={() => addSuggestionTask("Drink enough water today")}
                  >
                    <span>
                      <strong>Stay hydrated</strong>
                      <small>Keep water nearby throughout the day</small>
                    </span>
                    <Plus size={17} />
                  </button>
                </div>

                <p className="suggestion-footer">Tap + to add a suggestion to My Tasks.</p>
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