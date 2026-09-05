import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase";

import {
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  Clock3,
  CalendarClock,
  Plus,
  Trash2,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard({
  darkMode,
  setShowDashboard,
  setIsLoggedIn,
  openDashboard,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState("");

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
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getUserName = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Could not get user:", error);
        return;
      }

      if (user) {
        const fullName = user.user_metadata?.full_name;

        if (fullName) {
          setUserName(fullName);
        }
      }
    };

    getUserName();
  }, []);



  const addTask = () => {
    if (taskInput.trim() === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: taskInput.trim(),
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

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const formattedDate = currentTime.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const formattedTime = currentTime.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
  const getGreeting = () => {
    const hour = currentTime.getHours();

    if (hour < 12) {
      return "Good Morning";
    }

    if (hour < 17) {
      return "Good Afternoon";
    }

    if (hour < 21) {
      return "Good Evening";
    }

    return "Good Night";
  };
  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      <div className="dashboard-top">

        <div className="dashboard-date">
          <CalendarDays size={20} />
          <span>{formattedDate}</span>
        </div>

        <div className="dashboard-welcome">
         <div className="dashboard-welcome">
  <h1>
    {getGreeting()}, {userName || "there"}!
  </h1>

  <p>
    Stay consistent and keep moving forward.
  </p>
</div>
        </div>

        <div className="dashboard-clock">
          <Clock3 size={19} />
          <span>{formattedTime}</span>
        </div>

      </div>

      <div className="dashboard-stats">

        <div className="dashboard-stat">
          <div className="stat-icon">
            <ClipboardList size={21} />
          </div>

          <div>
            <p>All Tasks</p>
            <h2>{totalTasks}</h2>
          </div>
        </div>

        <div className="dashboard-stat">
          <div className="stat-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <p>Completed</p>
            <h2>{completedTasks}</h2>
          </div>
        </div>

        <div className="dashboard-stat">
          <div className="stat-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <p>Pending</p>
            <h2>{pendingTasks}</h2>
          </div>
        </div>

        <div className="dashboard-stat">
          <div className="stat-icon">
            <CalendarClock size={21} />
          </div>

          <div>
            <p>Progress</p>
            <h2>{progress}%</h2>
          </div>
        </div>

      </div>

      <div className="dashboard-main">

        <div className="tasks-section">

          <div className="section-header">
            <div>
              <h2>Today's Tasks</h2>
              <p>Keep moving forward.</p>
            </div>

            <div className="task-progress">
              {progress}%
            </div>
          </div>

          <div className="add-task">

            <input
              type="text"
              placeholder="Add a new task..."
              value={taskInput}
              onChange={(e) =>
                setTaskInput(e.target.value)
              }
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
              <Plus size={18} />
              Add
            </button>

          </div>

          <div className="task-list">

            {tasks.map((task) => (
              <div
                className={`task ${
                  task.completed ? "task-done" : ""
                }`}
                key={task.id}
              >

                <button
                  className="task-check"
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed && (
                    <CheckCircle2 size={20} />
                  )}
                </button>

                <div className="task-info">

                  <h3>{task.title}</h3>

                  <span
                    className={`category ${task.category.toLowerCase()}`}
                  >
                    {task.category}
                  </span>

                </div>

                <button
                  className="delete-task"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 size={18} />
                </button>

              </div>
            ))}

          </div>

        </div>

        <div className="progress-section">

          <div className="section-header">
            <div>
              <h2>Today's Progress</h2>
              <p>Your daily completion</p>
            </div>
          </div>

          <div className="progress-circle">

            <div
              className="progress-value"
              style={{
                background: `conic-gradient(#e99a16 ${
                  progress * 3.6
                }deg, #eeeeee 0deg)`,
              }}
            >

              <div className="progress-inner">
                <strong>{progress}%</strong>
                <span>Complete</span>
              </div>

            </div>

          </div>

          <div className="progress-info">

            <div>
              <span></span>
              <p>Completed</p>
              <strong>{completedTasks}</strong>
            </div>

            <div>
              <span></span>
              <p>Remaining</p>
              <strong>{pendingTasks}</strong>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;