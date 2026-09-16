import { useCallback, useEffect, useRef, useState } from "react";
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
  Flame,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
} from "lucide-react";

import "./Dashboard.css";

const FOCUS_DURATIONS = [15, 25, 45, 60];
const BREAK_MINUTES = 5;

const SOUND_OPTIONS = [
  { id: "off", label: "Off" },
  { id: "white", label: "White" },
  { id: "rain", label: "Rain" },
  { id: "waves", label: "Waves" },
];

const COLOR_OPTIONS = [
  "#3b82f6",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#84cc16",
  "#10b981",
  "#0ea5e9",
  "#64748b",
  "#78716c",
  "#d946ef",
  "#f59e0b",
  "#059669",
  "#7c3aed",
  "#db2777",
  "#ca8a04",
  "#475569",
];

const DEFAULT_CATEGORIES = [
  { name: "Study", color: "#3b82f6" },
  { name: "Personal", color: "#a855f7" },
  { name: "Health", color: "#ef4444" },
  { name: "Project", color: "#f59e0b" },
];

const WEEK_DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function getTodayIndex() {
  return (new Date().getDay() + 6) % 7;
}

function todayKey() {
  return new Date().toDateString();
}

function Dashboard({ darkMode, activePage, setActivePage }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("Study");
  const [taskCategoryOpen, setTaskCategoryOpen] = useState(false);
  const taskCategoryRef = useRef(null);

  // TIMER STATE
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [customMinutes, setCustomMinutes] = useState("");
  const [timerMode, setTimerMode] = useState("focus");
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // NEW TIMER FEATURES
  const [sessionsToday, setSessionsToday] = useState(0);
  const [sessionDate, setSessionDate] = useState(todayKey());
  const [autoStart, setAutoStart] = useState(true);
  const [soundType, setSoundType] = useState("off");
  const [notifyOn, setNotifyOn] = useState(false);

  const audioCtxRef = useRef(null);
  const noiseNodeRef = useRef(null);
  const gainNodeRef = useRef(null);

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Study");

  const [exercises, setExercises] = useState([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseSets, setExerciseSets] = useState("");
  const [exerciseReps, setExerciseReps] = useState("");

  const [milestones, setMilestones] = useState([]);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestoneText, setMilestoneText] = useState("");

  const todayIndex = getTodayIndex();

  const [weekDays, setWeekDays] = useState(
    WEEK_DAY_LABELS.map((label, i) => ({
      id: i,
      label,
      done: false,
    }))
  );

  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryColor, setCategoryColor] = useState("#94a3b8");
  const [categoryName, setCategoryName] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  const allCategories = [
    ...DEFAULT_CATEGORIES,
    ...categories.map((c) => ({
      name: c.name,
      color: c.color,
    })),
  ];

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const milestonesDone = milestones.filter((m) => m.done).length;

  const milestoneProgress =
    milestones.length === 0
      ? 0
      : Math.round((milestonesDone / milestones.length) * 100);

  const workoutsDone = weekDays.filter((d) => d.done).length;

  const workoutStreak = (() => {
    let streak = 0;

    for (let i = todayIndex; i >= 0; i--) {
      if (weekDays[i].done) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  })();

  // ===== DAILY RESET FOR SESSION COUNTER =====
  useEffect(() => {
    const check = () => {
      const key = todayKey();

      if (key !== sessionDate) {
        setSessionDate(key);
        setSessionsToday(0);
      }
    };

    check();

    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, [sessionDate]);

  // ===== AMBIENT SOUND =====
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtxRef.current = new Ctx();
    }

    return audioCtxRef.current;
  }, []);

  const stopNoise = useCallback(() => {
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
      } catch (e) {
        /* already stopped */
      }

      noiseNodeRef.current.disconnect();
      noiseNodeRef.current = null;
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
  }, []);

  const startNoise = useCallback(
    (type) => {
      const ctx = getAudioCtx();
      if (!ctx) return;

      if (ctx.state === "suspended") ctx.resume();

      stopNoise();

      // 2 seconds of looping noise
      const length = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === "rain" || type === "waves") {
        // brown-ish noise: smoother, deeper
        let last = 0;

        for (let i = 0; i < length; i++) {
          const white = Math.random() * 2 - 1;
          last = (last + 0.02 * white) / 1.02;
          data[i] = last * 3.5;
        }
      } else {
        for (let i = 0; i < length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = 0.12;

      if (type === "rain") {
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1200;
        source.connect(filter);
        filter.connect(gain);
      } else if (type === "waves") {
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 700;

        // slow swell in and out
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.12;

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.07;

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();

        source.connect(filter);
        filter.connect(gain);
      } else {
        source.connect(gain);
      }

      gain.connect(ctx.destination);
      source.start();

      noiseNodeRef.current = source;
      gainNodeRef.current = gain;
    },
    [getAudioCtx, stopNoise]
  );

  useEffect(() => {
    if (timerRunning && soundType !== "off") {
      startNoise(soundType);
    } else {
      stopNoise();
    }

    return () => stopNoise();
  }, [timerRunning, soundType, startNoise, stopNoise]);

  // stop audio entirely when leaving the focus page
  useEffect(() => {
    if (activePage !== "focus") stopNoise();
  }, [activePage, stopNoise]);

  // ===== END-OF-SESSION CHIME =====
  const playChime = useCallback(() => {
    const ctx = getAudioCtx();
    if (!ctx) return;

    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;

    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      const start = now + i * 0.18;

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.55);
    });
  }, [getAudioCtx]);

  // ===== DESKTOP NOTIFICATIONS =====
  const toggleNotify = async () => {
    if (notifyOn) {
      setNotifyOn(false);
      return;
    }

    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      setNotifyOn(true);
      return;
    }

    const result = await Notification.requestPermission();
    setNotifyOn(result === "granted");
  };

  const sendNotification = useCallback(
    (title, body) => {
      if (!notifyOn) return;
      if (!("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      new Notification(title, { body });
    },
    [notifyOn]
  );

  // ===== TIMER TICK =====
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((s) => Math.max(0, s - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  // ===== SESSION END HANDLER =====
  useEffect(() => {
    if (timerSeconds !== 0 || !timerRunning) return;

    playChime();

    if (timerMode === "focus") {
      setSessionsToday((c) => c + 1);

      sendNotification(
        "Focus session complete",
        `Time for a ${BREAK_MINUTES} minute break.`
      );

      setTimerMode("break");
      setTimerSeconds(BREAK_MINUTES * 60);
      setTimerRunning(autoStart);
    } else {
      sendNotification(
        "Break over",
        `Ready for another ${focusMinutes} minute session?`
      );

      setTimerMode("focus");
      setTimerSeconds(focusMinutes * 60);
      setTimerRunning(autoStart);
    }
  }, [
    timerSeconds,
    timerRunning,
    timerMode,
    autoStart,
    focusMinutes,
    playChime,
    sendNotification,
  ]);

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
        colorPickerRef.current &&
        !colorPickerRef.current.contains(e.target)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    return known.includes(name.toLowerCase())
      ? name.toLowerCase()
      : "custom";
  };

  // ===== TIMER CONTROLS =====
  const toggleTimer = () => {
    // resume audio context on a user gesture
    const ctx = getAudioCtx();
    if (ctx && ctx.state === "suspended") ctx.resume();

    setTimerRunning((current) => !current);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerMode("focus");
    setTimerSeconds(focusMinutes * 60);
  };

  const selectFocusDuration = (mins) => {
    if (timerRunning) return;

    setFocusMinutes(mins);
    setCustomMinutes("");
    setTimerMode("focus");
    setTimerSeconds(mins * 60);
  };

  const applyCustomMinutes = () => {
    if (timerRunning) return;

    const value = parseInt(customMinutes, 10);
    if (Number.isNaN(value)) return;

    const clamped = Math.min(180, Math.max(1, value));

    setFocusMinutes(clamped);
    setCustomMinutes(String(clamped));
    setTimerMode("focus");
    setTimerSeconds(clamped * 60);
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
    setExercises((current) =>
      current.filter((e) => e.id !== id)
    );
  };

  const addMilestone = () => {
    if (!milestoneText.trim()) return;

    setMilestones((current) => [
      ...current,
      {
        id: Date.now(),
        text: milestoneText.trim(),
        done: false,
      },
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
      current.map((m) =>
        m.id === id ? { ...m, done: !m.done } : m
      )
    );
  };

  const deleteMilestone = (id) => {
    setMilestones((current) =>
      current.filter((m) => m.id !== id)
    );
  };

  const toggleWorkoutDay = (id) => {
    setWeekDays((current) =>
      current.map((d) =>
        d.id === id ? { ...d, done: !d.done } : d
      )
    );
  };

  const addCategory = () => {
    if (!categoryName.trim()) return;

    setCategories((current) => [
      ...current,
      {
        id: Date.now(),
        color: categoryColor,
        name: categoryName.trim(),
      },
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
    setCategories((current) =>
      current.filter((c) => c.id !== id)
    );
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
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addTask();
                      }}
                      placeholder="What do you want to do?"
                    />

                    <div
                      className="custom-select"
                      ref={taskCategoryRef}
                    >
                      <button
                        type="button"
                        className="custom-select-trigger"
                        onClick={() =>
                          setTaskCategoryOpen((c) => !c)
                        }
                      >
                        <span className="custom-select-label">
                          <span
                            className="custom-select-dot"
                            style={{
                              backgroundColor:
                                getCategoryColor(category),
                            }}
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
                                category === cat.name
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                selectTaskCategory(cat.name)
                              }
                            >
                              <span
                                className="custom-select-dot"
                                style={{
                                  backgroundColor: cat.color,
                                }}
                              />

                              {cat.name}
                            </button>
                          ))}
                        </div>
                      )}
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
                              task.completed ? "checked" : ""
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
                            className={`category ${getCategoryClass(
                              task.category
                            )}`}
                          >
                            <span
                              className="category-dot"
                              style={{
                                backgroundColor:
                                  getCategoryColor(
                                    task.category
                                  ),
                              }}
                            />

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

                  {categories.length === 0 &&
                    !showCategoryForm && (
                      <div className="feature-empty">
                        <p>No categories yet.</p>
                      </div>
                    )}

                  {categories.length > 0 && (
                    <div className="category-chips">

                      {categories.map((cat) => (
                        <span
                          className="category-chip"
                          key={cat.id}
                        >

                          <span
                            className="category-chip-dot"
                            style={{
                              backgroundColor: cat.color,
                            }}
                          />

                          <span
                            style={{
                              color: cat.color,
                              fontWeight: 600,
                            }}
                          >
                            {cat.name}
                          </span>

                          <button
                            className="category-chip-delete"
                            onClick={() =>
                              deleteCategory(cat.id)
                            }
                          >
                            <X size={13} />
                          </button>

                        </span>
                      ))}

                    </div>
                  )}

                  {showCategoryForm ? (
                    <div className="inline-form">

                      <div
                        className="color-picker-wrapper"
                        ref={colorPickerRef}
                      >

                        <div className="inline-form-row">

                          <button
                            type="button"
                            className="color-picker-trigger"
                            onClick={() =>
                              setShowColorPicker((c) => !c)
                            }
                          >
                            <span
                              className="color-picker-swatch"
                              style={{
                                backgroundColor:
                                  categoryColor,
                              }}
                            />

                            <ChevronDown size={16} />
                          </button>

                          <input
                            type="text"
                            className="inline-form-input"
                            placeholder="Category name"
                            value={categoryName}
                            onChange={(e) =>
                              setCategoryName(e.target.value)
                            }
                            autoFocus
                          />

                        </div>

                        {showColorPicker && (
                          <div className="color-picker-dropdown">

                            {COLOR_OPTIONS.map((c) => {

                              const colorAlreadyUsed =
                                allCategories.some(
                                  (cat) => cat.color === c
                                ) && categoryColor !== c;

                              return (
                                <button
                                  type="button"
                                  key={c}
                                  disabled={colorAlreadyUsed}
                                  className={`color-picker-option ${
                                    categoryColor === c
                                      ? "selected"
                                      : ""
                                  }`}
                                  style={{
                                    backgroundColor: c,
                                  }}
                                  onClick={() =>
                                    selectColor(c)
                                  }
                                />
                              );
                            })}

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
                      onClick={() =>
                        setShowCategoryForm(true)
                      }
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
                    {timerMode === "focus"
                      ? "Pomodoro Timer"
                      : "Break Time"}
                  </strong>
                </div>

                <span
                  className={
                    timerMode === "break"
                      ? "break-badge"
                      : ""
                  }
                >
                  {timerMode === "focus"
                    ? `${focusMinutes} min focus`
                    : `${BREAK_MINUTES} min break`}
                </span>

              </div>

              {/* SESSION COUNTER */}
              <div className="session-counter">
                <span className="session-counter-dots">
                  {Array.from({
                    length: Math.min(sessionsToday, 8),
                  }).map((_, i) => (
                    <span key={i} className="session-dot" />
                  ))}
                </span>

                <span className="session-counter-text">
                  <strong>{sessionsToday}</strong>{" "}
                  {sessionsToday === 1 ? "session" : "sessions"}{" "}
                  completed today
                </span>
              </div>

              {timerMode === "focus" && (
                <div className="duration-select">

                  {FOCUS_DURATIONS.map((min) => (
                    <button
                      key={min}
                      className={`duration-btn ${
                        focusMinutes === min &&
                        customMinutes === ""
                          ? "active"
                          : ""
                      }`}
                      disabled={timerRunning}
                      onClick={() =>
                        selectFocusDuration(min)
                      }
                    >
                      {min}m
                    </button>
                  ))}

                  <input
                    type="number"
                    min="1"
                    max="180"
                    className="duration-custom"
                    placeholder="Custom"
                    value={customMinutes}
                    disabled={timerRunning}
                    onChange={(e) =>
                      setCustomMinutes(e.target.value)
                    }
                    onBlur={applyCustomMinutes}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        applyCustomMinutes();
                        e.target.blur();
                      }
                    }}
                  />

                </div>
              )}

              <div
                className={`timer-display ${
                  timerMode === "break"
                    ? "break-mode"
                    : ""
                }`}
              >
                {minutes}:{seconds}
              </div>

              <div className="timer-controls">

                <button
                  className={`timer-start ${
                    timerMode === "break"
                      ? "break-start"
                      : ""
                  }`}
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

              {/* TIMER OPTIONS */}
              <div className="timer-options">

                {/* AMBIENT SOUND */}
                <div className="timer-option-row">

                  <div className="timer-option-label">
                    {soundType === "off" ? (
                      <VolumeX size={17} />
                    ) : (
                      <Volume2 size={17} />
                    )}
                    <span>Ambient sound</span>
                  </div>

                  <div className="sound-options">
                    {SOUND_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        className={`sound-btn ${
                          soundType === s.id ? "active" : ""
                        }`}
                        onClick={() => setSoundType(s.id)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                </div>

                {/* AUTO-START */}
                <div className="timer-option-row">

                  <div className="timer-option-label">
                    <RotateCcw size={17} />
                    <span>Auto-start next session</span>
                  </div>

                  <button
                    className={`toggle-switch ${
                      autoStart ? "on" : ""
                    }`}
                    onClick={() => setAutoStart((v) => !v)}
                    aria-label="Toggle auto-start"
                  >
                    <span className="toggle-knob" />
                  </button>

                </div>

                {/* NOTIFICATIONS */}
                <div className="timer-option-row">

                  <div className="timer-option-label">
                    {notifyOn ? (
                      <Bell size={17} />
                    ) : (
                      <BellOff size={17} />
                    )}
                    <span>Notify when session ends</span>
                  </div>

                  <button
                    className={`toggle-switch ${
                      notifyOn ? "on" : ""
                    }`}
                    onClick={toggleNotify}
                    aria-label="Toggle notifications"
                  >
                    <span className="toggle-knob" />
                  </button>

                </div>

              </div>

            </div>

          </section>
        )}

        {activePage === "goals" && (
          <section className="dashboard-page">

            <div className="dashboard-page-heading">
              <h1>Goals</h1>
              <p>
                Track workouts, hit milestones, and stay
                consistent.
              </p>
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

                {exercises.length === 0 &&
                  !showExerciseForm && (
                    <div className="feature-empty">
                      <p>No exercises yet.</p>
                    </div>
                  )}

                {exercises.length > 0 && (
                  <div className="exercise-list">

                    {exercises.map((exercise) => (
                      <div
                        className="exercise-item"
                        key={exercise.id}
                      >

                        <span className="exercise-name">
                          {exercise.name}
                        </span>

                        <div className="exercise-right">

                          <span className="exercise-sets">
                            {exercise.sets} ×{" "}
                            {exercise.reps}
                          </span>

                          <button
                            className="exercise-delete"
                            onClick={() =>
                              deleteExercise(
                                exercise.id
                              )
                            }
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
                      onChange={(e) =>
                        setExerciseName(e.target.value)
                      }
                      autoFocus
                    />

                    <div className="inline-form-row">

                      <input
                        type="text"
                        className="inline-form-input"
                        placeholder="Sets (e.g. 3)"
                        value={exerciseSets}
                        onChange={(e) =>
                          setExerciseSets(e.target.value)
                        }
                      />

                      <input
                        type="text"
                        className="inline-form-input"
                        placeholder="Reps (e.g. 12 or 30s)"
                        value={exerciseReps}
                        onChange={(e) =>
                          setExerciseReps(e.target.value)
                        }
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

                      <button
                        className="inline-form-save"
                        onClick={addExercise}
                      >
                        <Check size={16} />
                        Save
                      </button>

                    </div>

                  </div>
                ) : (
                  <button
                    className="feature-add-btn"
                    onClick={() =>
                      setShowExerciseForm(true)
                    }
                  >
                    <Plus size={18} />
                    Add Exercise
                  </button>
                )}

              </div>

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
                        style={{
                          width: `${milestoneProgress}%`,
                        }}
                      />
                    </div>

                    <span>
                      {milestonesDone} of{" "}
                      {milestones.length} done
                    </span>

                  </div>
                )}

                {milestones.length === 0 &&
                  !showMilestoneForm && (
                    <div className="feature-empty">
                      <p>No milestones yet.</p>
                    </div>
                  )}

                {milestones.length > 0 && (
                  <div className="milestone-list">

                    {milestones.map((m) => (
                      <div
                        className={`milestone-item ${
                          m.done
                            ? "milestone-done"
                            : ""
                        }`}
                        key={m.id}
                      >

                        <button
                          className={`milestone-check ${
                            m.done ? "checked" : ""
                          }`}
                          onClick={() =>
                            toggleMilestone(m.id)
                          }
                        >
                          {m.done && (
                            <Check size={14} />
                          )}
                        </button>

                        <span className="milestone-text">
                          {m.text}
                        </span>

                        <button
                          className="exercise-delete"
                          onClick={() =>
                            deleteMilestone(m.id)
                          }
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
                      onChange={(e) =>
                        setMilestoneText(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addMilestone();
                        }
                      }}
                      autoFocus
                    />

                    <div className="inline-form-actions">

                      <button
                        className="inline-form-cancel"
                        onClick={cancelMilestoneForm}
                      >
                        <X size={16} />
                        Cancel
                      </button>

                      <button
                        className="inline-form-save"
                        onClick={addMilestone}
                      >
                        <Check size={16} />
                        Save
                      </button>

                    </div>

                  </div>
                ) : (
                  <button
                    className="feature-add-btn"
                    onClick={() =>
                      setShowMilestoneForm(true)
                    }
                  >
                    <Plus size={18} />
                    Add Milestone
                  </button>
                )}

              </div>

              <div className="consistency-card">

                <div className="consistency-top">

                  <span className="consistency-label">
                    Consistency
                  </span>

                  <span className="consistency-ratio">
                    {workoutsDone} / 7
                  </span>

                </div>

                <h2 className="consistency-title">
                  This week
                </h2>

                <div className="consistency-days">

                  {weekDays.map((day) => (
                    <div
                      className="consistency-day"
                      key={day.id}
                    >

                      <span className="consistency-day-label">
                        {day.label}
                      </span>

                      <button
                        type="button"
                        className={`consistency-circle ${
                          day.done ? "done" : ""
                        } ${
                          day.id === todayIndex
                            ? "today"
                            : ""
                        }`}
                        onClick={() =>
                          toggleWorkoutDay(day.id)
                        }
                      >
                        {day.done ? (
                          <Check
                            size={18}
                            strokeWidth={3}
                          />
                        ) : day.id === todayIndex ? (
                          <span className="consistency-dot" />
                        ) : null}
                      </button>

                    </div>
                  ))}

                </div>

                <div className="consistency-footer">

                  <Flame
                    size={16}
                    className="consistency-flame"
                  />

                  <span>
                    <strong>
                      {workoutStreak} day
                    </strong>{" "}
                    streak — keep it going
                  </span>

                </div>

              </div>

            </div>

          </section>
        )}

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

              {allCategories.map((item) => (
                <button
                  key={item.name}
                  className={`edit-category ${getCategoryClass(
                    item.name
                  )} ${
                    editCategory === item.name
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setEditCategory(item.name)
                  }
                >
                  <span
                    className="edit-category-dot"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />

                  {item.name}
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