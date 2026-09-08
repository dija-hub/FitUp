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
} from "lucide-react";

import { supabase } from "./utils/supabase";
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
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Study");

  // Daily streak data
  const [completionDates, setCompletionDates] = useState([]);

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

  // ---------------- DAILY STREAK ----------------

  const getToday = () => {
    const today = new Date();

    return `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const updateStreak = () => {
    const today = getToday();

    setCompletionDates((dates) => {
      if (!dates.includes(today)) {
        return [...dates, today];
      }

      return dates;
    });
  };

  const calculateStreak = () => {
    let streak = 0;
    const currentDate = new Date();

    while (true) {
      const dateString = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(
        currentDate.getDate()
      ).padStart(2, "0")}`;

      if (!completionDates.includes(dateString)) {
        break;
      }

      streak++;

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const dailyStreak = calculateStreak();

  // ---------------- TASK FUNCTIONS ----------------

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

    const task = tasks.find((task) => task.id === id);

    if (task && !task.completed) {
      updateStreak();
    }
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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return;
    }

    setIsLoggedIn(false);
    setShowDashboard(false);
  };

  const minutes = Math.floor(timerSeconds / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (timerSeconds % 60)
    .toString()
    .padStart(2, "0");

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>

      {/* YOUR EXISTING DASHBOARD CONTENT */}

      {/* 
        Keep your existing top section,
        stats cards, task section,
        completion tracker and timer here.
      */}

      {/* DAILY STREAK */}
      <div className="weekly-progress-card">
        <div className="weekly-progress-header">
          <div>
            <span className="section-label">Consistency</span>
            <h3>Daily Streak</h3>
          </div>
        </div>

        <div className="daily-streak-content">
          <div className="streak-number">
            {dailyStreak}
          </div>

          <div className="streak-text">
            <strong>
              Day{dailyStreak !== 1 ? "s" : ""}
            </strong>

            <span>
              {dailyStreak === 0
                ? "Complete a task today to start your streak!"
                : dailyStreak === 1
                ? "Great start! Keep it going tomorrow."
                : "Keep going! You're building a strong habit."}
            </span>
          </div>
        </div>
      </div>

      {/* SIGN OUT */}
      <button
        className="sign-out-btn"
        onClick={handleSignOut}
      >
        Sign Out
      </button>

      {/* EDIT MODAL */}
      {editingTask && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Edit Task</h3>

            <input
              value={editTitle}
              onChange={(e) =>
                setEditTitle(e.target.value)
              }
              placeholder="Task title"
            />

            <select
              value={editCategory}
              onChange={(e) =>
                setEditCategory(e.target.value)
              }
            >
              <option value="Study">Study</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
              <option value="Project">Project</option>
            </select>

            <div className="edit-modal-buttons">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setEditTitle("");
                  setEditCategory("Study");
                }}
              >
                Cancel
              </button>

              <button onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;