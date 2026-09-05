import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase";
import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  CalendarClock,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard({
  darkMode,
  setShowDashboard,
  setIsLoggedIn,
  openDashboard,
}) {
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());

  const [taskInput, setTaskInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Study");

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
      category: "Fitness",
      completed: false,
    },
    {
      id: 4,
      title: "Build ToDo App",
      category: "Work",
      completed: true,
    },
    {
      id: 5,
      title: "Learn JavaScript",
      category: "Study",
      completed: false,
    },
  ]);

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hour = now.getHours();

      setCurrentTime(now);

      if (hour >= 5 && hour < 12) {
        setGreeting("Good morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good afternoon");
      } else if (hour >= 17 && hour < 21) {
        setGreeting("Good evening");
      } else {
        setGreeting("Good night");
      }
    };

    updateTimeAndGreeting();

    const timer = setInterval(updateTimeAndGreeting, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getUserName = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.fullName ||
          user.user_metadata?.name ||
          "there";

        setUserName(fullName);
      }
    };

    getUserName();
  }, []);

  const addTask = () => {
    if (!taskInput.trim()) {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: taskInput,
      category: selectedCategory,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskInput("");
  };

  const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
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
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const dayName = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  const inProgressTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  return (
    <main className={`dashboard ${darkMode ? "dark" : ""}`}>
      <section className="dashboard-header">
        <div className="dashboard-date">
          <strong>{formattedDate}</strong>
          <span>{dayName}</span>
        </div>

        <div className="dashboard-welcome">
          <h1>
            {greeting}, {userName} 👋
          </h1>

          <p>Let's make today productive.</p>

          <span>
            Stay consistent and keep moving forward.
          </span>
        </div>

        <div className="dashboard-time">
          {formatTime()}
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orange">
            <ClipboardList size={26} />
          </div>

          <div>
            <p>All Tasks</p>
            <h2>{totalTasks}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle2 size={26} />
          </div>

          <div>
            <p>Done</p>
            <h2>{completedTasks}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <Clock3 size={26} />
          </div>

          <div>
            <p>In Progress</p>
            <h2>{inProgressTasks}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <CalendarClock size={26} />
          </div>

          <div>
            <p>Pending</p>
            <h2>{pendingTasks}</h2>
          </div>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="dashboard-left">
          <div className="add-task-card">
            <h2>Add New Task</h2>

            <div className="add-task-form">
              <input
                type="text"
                placeholder="What do you want to do?"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTask();
                  }
                }}
              />

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
              >
                <option value="Study">Study</option>
                <option value="Fitness">Fitness</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
              </select>

              <button onClick={addTask}>
                <Plus size={21} />
                Add Task
              </button>
            </div>
          </div>

          <div className="tasks-card">
            <div className="tasks-header">
              <h2>My Tasks</h2>

              <span>{totalTasks} tasks</span>
            </div>

            <div className="tasks-list">
              {tasks.map((task) => (
                <div
                  className={`task-item ${
                    task.completed ? "completed" : ""
                  }`}
                  key={task.id}
                >
                  <div className="task-left">
                    <button
                      className="task-checkbox"
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed && <CheckCircle2 size={18} />}
                    </button>

                    <span className="task-title">
                      {task.title}
                    </span>
                  </div>

                  <div className="task-right">
                    <span className="task-category">
                      {task.category}
                    </span>

                    <button className="edit-task">
                      <Pencil size={18} />
                    </button>

                    <button
                      className="delete-task"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="weekly-progress-card">
          <h2>Weekly Progress</h2>

          <div className="chart">
            <div className="bar-container">
              <div className="bar" style={{ height: "35%" }}></div>
              <span>Mon</span>
            </div>

            <div className="bar-container">
              <div className="bar" style={{ height: "50%" }}></div>
              <span>Tue</span>
            </div>

            <div className="bar-container">
              <div className="bar" style={{ height: "65%" }}></div>
              <span>Wed</span>
            </div>

            <div className="bar-container">
              <div
                className="bar active-bar"
                style={{ height: "85%" }}
              ></div>
              <span>Thu</span>
            </div>

            <div className="bar-container">
              <div className="bar" style={{ height: "50%" }}></div>
              <span>Fri</span>
            </div>

            <div className="bar-container">
              <div className="bar" style={{ height: "60%" }}></div>
              <span>Sat</span>
            </div>

            <div className="bar-container">
              <div className="bar" style={{ height: "70%" }}></div>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;