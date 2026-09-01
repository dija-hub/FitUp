import { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  Clock3,
  CalendarClock,
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const [taskInput, setTaskInput] = useState("");
  const [category, setCategory] = useState("Personal");
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

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editCategory, setEditCategory] = useState("Personal");

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const date = currentTime.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const day = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const time = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const categoryColors = {
    Study: "orange",
    Personal: "green",
    Health: "yellow",
    Project: "red",
    Other: "purple",
  };

  function addTask() {
    if (taskInput.trim() === "") return;

    const newTask = {
      id: Date.now(),
      name: taskInput.trim(),
      category: category,
      color: categoryColors[category],
      completed: false,
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
    setTaskInput("");
    setCategory("Personal");
  }

  function deleteTask(id) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  }

  function startEditing(task) {
    setEditingId(task.id);
    setEditText(task.name);
    setEditCategory(task.category);
  }

  function saveEdit(id) {
    if (editText.trim() === "") return;

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              name: editText.trim(),
              category: editCategory,
              color: categoryColors[editCategory],
            }
          : task
      )
    );

    setEditingId(null);
    setEditText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  function toggleTask(id) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function clearCompleted() {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => !task.completed)
    );
  }

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  return (
    <main className="dashboard">
      <section className="dashboard-top">
        <div className="date-box">
          <CalendarDays size={24} />

          <div>
            <p>{date}</p>
            <span>{day}</span>
          </div>
        </div>

        <div className="greeting">
          <h1>Good morning, Khadija! 👋</h1>
          <p>Let's make today productive.</p>
        </div>

        <div className="time-box">
          <span>☀️</span>
          <p>{time}</p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card total-card">
          <div className="stat-icon">
            <ClipboardList size={26} />
          </div>

          <div>
            <p>All Tasks</p>
            <h2>{tasks.length}</h2>
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
            <h2>{pendingTasks}</h2>
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
            <h2>Add New Task</h2>

            <div className="add-task-row">
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Study">Study</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Project">Project</option>
                <option value="Other">Other</option>
              </select>

              <button onClick={addTask}>
                <Plus size={20} />
                Add Task
              </button>
            </div>
          </div>

          <div className="tasks-card">
            <div className="tasks-heading">
              <div>
                <h2>My Tasks</h2>
                <p>Keep track of everything you need to do.</p>
              </div>

              <span className="task-count">
                {tasks.length} tasks
              </span>
            </div>

            <div className="task-list">
              {tasks.length === 0 ? (
                <div className="empty-tasks">
                  <ClipboardList size={40} />
                  <h3>No tasks yet</h3>
                  <p>Add your first task above.</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div className="task-item" key={task.id}>
                    <div
                      className={`task-line ${task.color}`}
                    ></div>

                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />

                    {editingId === task.id ? (
                      <div className="edit-task-area">
                        <input
                          className="edit-input"
                          value={editText}
                          onChange={(e) =>
                            setEditText(e.target.value)
                          }
                        />

                        <select
                          value={editCategory}
                          onChange={(e) =>
                            setEditCategory(e.target.value)
                          }
                        >
                          <option value="Study">Study</option>
                          <option value="Personal">
                            Personal
                          </option>
                          <option value="Health">Health</option>
                          <option value="Project">
                            Project
                          </option>
                          <option value="Other">Other</option>
                        </select>

                        <button
                          className="save-btn"
                          onClick={() => saveEdit(task.id)}
                        >
                          <Save size={17} />
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={cancelEdit}
                        >
                          <X size={17} />
                        </button>
                      </div>
                    ) : (
                      <>
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
                            onClick={() => startEditing(task)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            {tasks.length > 0 && (
              <div className="task-bottom">
                <p>
                  {completedTasks} of {tasks.length} completed
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
            <div className="progress-circle">
              <div className="circle-inner">
                <strong>{completionPercentage}%</strong>
              </div>
            </div>

            <div className="completion-text">
              <h3>
                {completedTasks} of {tasks.length} tasks
              </h3>
              <p>completed</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;