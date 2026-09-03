import { useEffect, useState } from "react";

import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  CalendarClock,
  Plus,
  Trash2,
  Pencil,
  X,
  Timer,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard({ darkMode }) {
  const [taskInput, setTaskInput] = useState("");
  const [category, setCategory] = useState("Study");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Study React",
      category: "Study",
      color: "orange",
      completed: false,
    },
    {
      id: 2,
      name: "Read a book",
      category: "Personal",
      color: "green",
      completed: true,
    },
    {
      id: 3,
      name: "Practice basketball",
      category: "Health",
      color: "yellow",
      completed: false,
    },
    {
      id: 4,
      name: "Build ToDo App",
      category: "Project",
      color: "red",
      completed: false,
    },
    {
      id: 5,
      name: "Morning Workout",
      category: "Health",
      color: "green",
      completed: true,
    },
  ]);

  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      setCurrentDate(now);
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    if (!timerRunning) return;

    const timer = setInterval(() => {
      setTimerSeconds((previousSeconds) => {
        if (previousSeconds <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return previousSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning]);

  const formattedTimer = `${String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:${String(
    timerSeconds % 60
  ).padStart(2, "0")}`;

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  
  const formattedDay = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
  });


  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  
  const getCategoryColor = (categoryName) => {
    if (categoryName === "Study") {
      return "orange";
    }

    if (categoryName === "Personal") {
      return "green";
    }

    if (categoryName === "Health") {
      return "yellow";
    }

    if (categoryName === "Project") {
      return "red";
    }

    return "orange";
  };


  const handleTaskSubmit = () => {
    if (taskInput.trim() === "") {
      return;
    }

    const taskColor = getCategoryColor(category);

    
    if (editingId !== null) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === editingId
            ? {
                ...task,
                name: taskInput.trim(),
                category: category,
                color: taskColor,
              }
            : task
        )
      );

      setEditingId(null);
    } else {
     
      const newTask = {
        id: Date.now(),
        name: taskInput.trim(),
        category: category,
        color: taskColor,
        completed: false,
      };

      setTasks((previousTasks) => [...previousTasks, newTask]);
    }

    setTaskInput("");
    setCategory("Study");
    setCategoryOpen(false);
  };

  
  const deleteTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  };

  
  const toggleTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

 
  const editTask = (task) => {
    setTaskInput(task.name);
    setCategory(task.category);
    setCategoryOpen(false);
    setEditingId(task.id);
  };

  
  const cancelEdit = () => {
    setTaskInput("");
    setCategory("Study");
    setCategoryOpen(false);
    setEditingId(null);
  };


  const clearCompleted = () => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => !task.completed)
    );
  };


  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
     

      <section className="dashboard-top">
        <div className="date-box">
          <div>
            <p>{formattedDate}</p>
            <span>{formattedDay}</span>
          </div>
        </div>

        <div className="greeting">
          <h1>Good morning, Khadija!</h1>
          <p>Let's make today productive.</p>
        </div>

        <div className="time-box">
          <p>{formattedTime}</p>
        </div>
      </section>


      <section className="stats-grid">
        <div className="stat-card total-card">
          <div className="stat-icon">
            <ClipboardList size={26} />
          </div>

          <div>
            <p>All Tasks</p>
            <h2>{totalTasks}</h2>
          </div>
        </div>

        <div className="stat-card done-card">
          <div className="stat-icon">
            <CheckCircle2 size={26} />
          </div>

          <div>
            <p>Done</p>
            <h2>{completedTasks}</h2>
          </div>
        </div>

        <div className="stat-card progress-card">
          <div className="stat-icon">
            <Clock3 size={26} />
          </div>

          <div>
            <p>In Progress</p>
            <h2>{inProgressTasks}</h2>
          </div>
        </div>

        <div className="stat-card pending-card">
          <div className="stat-icon">
            <CalendarClock size={26} />
          </div>

          <div>
            <p>Pending</p>
            <h2>{pendingTasks}</h2>
          </div>
        </div>
      </section>

      

      <section className="dashboard-content">


        <div className="left-column">

          

          <div className="add-task-card">
            <h2>
              {editingId !== null ? "Edit Task" : "Add New Task"}
            </h2>

            <div className="add-task-row">

              <input
                type="text"
                placeholder="What do you want to do?"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTaskSubmit();
                  }
                }}
              />

              <div className="category-dropdown">
                <button
                  type="button"
                  className={`category-select ${categoryOpen ? "open" : ""}`}
                  onClick={() => setCategoryOpen((previous) => !previous)}
                >
                  <span className="category-current">
                    <span className={`option-dot ${getCategoryColor(category)}`}></span>
                    <span>{category}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={categoryOpen ? "category-chevron rotated" : "category-chevron"}
                  />
                </button>

                {categoryOpen && (
                  <div className="category-menu">
                    {["Study", "Personal", "Health", "Project"].map((item) => (
                      <button
                        type="button"
                        key={item}
                        className={`category-option ${
                          category === item ? "selected" : ""
                        }`}
                        onClick={() => {
                          setCategory(item);
                          setCategoryOpen(false);
                        }}
                      >
                        <span className={`option-dot ${getCategoryColor(item)}`}></span>
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="add-task-btn"
                onClick={handleTaskSubmit}
              >
                <Plus size={20} />

                {editingId !== null
                  ? "Save"
                  : "Add Task"}
              </button>

              {editingId !== null && (
                <button
                  className="cancel-btn"
                  onClick={cancelEdit}
                >
                  <X size={19} />
                </button>
              )}

            </div>
          </div>

         

          <div className="tasks-card">
            <div className="tasks-header">
              <h2>My Tasks</h2>

              <span className="task-count">
                {tasks.length} tasks
              </span>
            </div>

            <div className="task-list">

              {tasks.length === 0 ? (
                <div className="empty-tasks">
                  <ClipboardList size={40} />
                  <p>No tasks yet.</p>
                  <span>Add your first task above.</span>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    className={`task-item ${
                      task.completed ? "task-completed" : ""
                    }`}
                    key={task.id}
                  >

                    <div
                      className={`task-line ${task.color}`}
                    ></div>

                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        toggleTask(task.id)
                      }
                    />

                    <p
                      className={
                        task.completed
                          ? "completed-task"
                          : ""
                      }
                    >
                      {task.name}
                    </p>

                    <span
                      className={`category ${task.color}`}
                    >
                      {task.category}
                    </span>

                    <div className="task-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          editTask(task)
                        }
                        title="Edit task"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteTask(task.id)
                        }
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>
                ))
              )}

            </div>

            {tasks.length > 0 && (
              <div className="task-bottom">

                <p>
                  {completedTasks} of {totalTasks} completed
                </p>

                <button
                  className="clear-btn"
                  onClick={clearCompleted}
                >
                  Clear completed
                  <Trash2 size={17} />
                </button>

              </div>
            )}
          </div>
        </div>

      

        <div className="progress-card-main">

          <h2>Weekly Progress</h2>

          <div className="chart">

            <div className="chart-grid">
              <span className="grid-line line-1"></span>
              <span className="grid-line line-2"></span>
              <span className="grid-line line-3"></span>
              <span className="grid-line line-4"></span>
            </div>

            <div className="bars">

              <div className="bar-group">
                <div className="bar mon"></div>
                <span>Mon</span>
              </div>

              <div className="bar-group">
                <div className="bar tue"></div>
                <span>Tue</span>
              </div>

              <div className="bar-group">
                <div className="bar wed"></div>
                <span>Wed</span>
              </div>

              <div className="bar-group">
                <div className="bar thu"></div>
                <span>Thu</span>
              </div>

              <div className="bar-group">
                <div className="bar fri"></div>
                <span>Fri</span>
              </div>

              <div className="bar-group">
                <div className="bar sat"></div>
                <span>Sat</span>
              </div>

              <div className="bar-group">
                <div className="bar sun"></div>
                <span>Sun</span>
              </div>

            </div>
          </div>

        

          <div className="completion-section">

            <div
              className="progress-circle"
              style={{
                background: `conic-gradient(
                  #ff7200 0deg ${completionPercentage * 3.6}deg,
                  #f4e5d7 ${completionPercentage * 3.6}deg 360deg
                )`,
              }}
            >
              <div className="circle-inner">
                <strong>
                  {completionPercentage}%
                </strong>
              </div>
            </div>

            <div className="completion-text">

              <h3>
                {completedTasks} of {totalTasks} tasks
              </h3>

              <p>completed</p>

            </div>

          </div>



          <div className="focus-timer">
            <div className="focus-timer-header">
              <div className="focus-timer-title">
                <Timer size={20} />
                <h3>Focus Timer</h3>
              </div>
              <span>25 min focus</span>
            </div>

            <div className="timer-display">{formattedTimer}</div>

            <div className="timer-actions">
              <button
                className="timer-main-btn"
                onClick={() => setTimerRunning((previous) => !previous)}
              >
                {timerRunning ? <Pause size={18} /> : <Play size={18} />}
                {timerRunning ? "Pause" : "Start"}
              </button>

              <button
                className="timer-reset-btn"
                onClick={resetTimer}
                title="Reset timer"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Dashboard;