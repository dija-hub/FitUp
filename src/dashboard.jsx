import { useState } from "react";
import {
  Check,
  Plus,
  Trash2,
  Edit3,
  ListTodo,
  TrendingUp,
  Target,
  CircleCheck,
  CalendarDays,
} from "lucide-react";
import "./Dashboard.css";

function Dashboard({ darkMode, setShowDashboard, setIsLoggedIn }) {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Study React",
      category: "Study",
      completed: true,
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
      completed: false,
    },
    {
      id: 5,
      title: "Morning walk",
      category: "Fitness",
      completed: false,
    },
  ]);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const remainingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const weeklyProgress = [
    { day: "Mon", value: 4 },
    { day: "Tue", value: 6 },
    { day: "Wed", value: 3 },
    { day: "Thu", value: 7 },
    { day: "Fri", value: 5 },
    { day: "Sat", value: 8 },
    { day: "Sun", value: completedTasks },
  ];

  const maxWeeklyValue = Math.max(
    ...weeklyProgress.map((item) => item.value),
    1
  );

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

  const addTask = () => {
    const title = window.prompt("Enter your task");

    if (!title || title.trim() === "") {
      return;
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: Date.now(),
        title: title.trim(),
        category: "Personal",
        completed: false,
      },
    ]);
  };

  const editTask = (id) => {
    const task = tasks.find((item) => item.id === id);

    if (!task) {
      return;
    }

    const newTitle = window.prompt("Edit your task", task.title);

    if (!newTitle || newTitle.trim() === "") {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === id
          ? { ...item, title: newTitle.trim() }
          : item
      )
    );
  };

  const clearCompleted = () => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => !task.completed)
    );
  };

  const handleSignOut = async () => {
    setIsLoggedIn(false);
    setShowDashboard(false);
  };

  const getCategoryClass = (category) => {
    return category.toLowerCase();
  };

  return (
    <div className={`dashboard ${darkMode ? "dashboard-dark" : ""}`}>
      <main className="dashboard-content">

        <div className="dashboard-date">
          <CalendarDays size={15} />
          <span className="today-label">TODAY</span>
          <span className="date-dot">•</span>
          <span>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="dashboard-header">
          <div>
            <h1>
              Good evening, <span>Falak.</span>
            </h1>

            <p>
              Small steps today create big results tomorrow.
            </p>
          </div>

          <button className="add-task-btn" onClick={addTask}>
            <Plus size={19} />
            Add Task
          </button>
        </div>

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-top">
              <div className="stat-icon orange">
                <ListTodo size={21} />
              </div>

              <span className="stat-label">TODAY</span>
            </div>

            <div className="stat-number">{totalTasks}</div>

            <p>Total tasks</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <div className="stat-icon green">
                <CircleCheck size={21} />
              </div>

              <span className="stat-label">DONE</span>
            </div>

            <div className="stat-number">{completedTasks}</div>

            <p>Tasks completed</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <div className="stat-icon blue">
                <TrendingUp size={21} />
              </div>

              <span className="stat-label">PROGRESS</span>
            </div>

            <div className="stat-number">{progress}%</div>

            <p>Daily progress</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <div className="stat-icon purple">
                <Target size={21} />
              </div>

              <span className="stat-label">LEFT</span>
            </div>

            <div className="stat-number">{remainingTasks}</div>

            <p>Tasks remaining</p>
          </div>

        </section>

        <section className="progress-card">

          <div className="progress-info">
            <div>
              <span className="section-label">
                TODAY'S PROGRESS
              </span>

              <h2>
                Keep going!
              </h2>

              <p>
                {completedTasks} of {totalTasks} tasks completed today.
              </p>
            </div>

            <div className="progress-circle">
              <svg viewBox="0 0 100 100">
                <circle
                  className="progress-background"
                  cx="50"
                  cy="50"
                  r="42"
                />

                <circle
                  className="progress-value"
                  cx="50"
                  cy="50"
                  r="42"
                  style={{
                    strokeDasharray: `${progress * 2.64} 264`,
                  }}
                />
              </svg>

              <span>{progress}%</span>
            </div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

        </section>

        <section className="task-section">

          <div className="task-header">

            <div>
              <span className="section-label">
                YOUR TASKS
              </span>

              <h2>Today's Tasks</h2>

              <p>
                Stay consistent and keep moving forward.
              </p>
            </div>

            <div className="task-header-actions">

              {completedTasks > 0 && (
                <button
                  className="clear-btn"
                  onClick={clearCompleted}
                >
                  Clear completed
                </button>
              )}

              <button
                className="task-add-small"
                onClick={addTask}
              >
                <Plus size={18} />
              </button>

            </div>

          </div>

          <div className="task-counter">
            <span>
              {completedTasks} of {totalTasks} completed
            </span>

            <span>{remainingTasks} remaining</span>
          </div>

          <div className="task-list">

            {tasks.length === 0 ? (
              <div className="empty-tasks">
                <CircleCheck size={40} />
                <h3>No tasks yet</h3>
                <p>
                  Add a task and start making progress.
                </p>

                <button onClick={addTask}>
                  <Plus size={17} />
                  Add your first task
                </button>
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

                  <div className="task-info">

                    <div className="task-title-row">
                      <span
                        className={`category-dot ${getCategoryClass(
                          task.category
                        )}`}
                      ></span>

                      <h3>{task.title}</h3>
                    </div>

                    <span className="task-category">
                      {task.category}
                    </span>

                  </div>

                  <div className="task-actions">

                    <button
                      onClick={() => editTask(task.id)}
                      aria-label="Edit task"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      aria-label="Delete task"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>
              ))
            )}

          </div>

        </section>

        <section className="weekly-section">

          <div className="weekly-header">
            <div>
              <span className="section-label">
                THIS WEEK
              </span>

              <h2>Weekly Progress</h2>

              <p>
                Your activity throughout the week.
              </p>
            </div>

            <div className="weekly-total">
              <strong>
                {weeklyProgress.reduce(
                  (total, item) => total + item.value,
                  0
                )}
              </strong>

              <span>tasks</span>
            </div>
          </div>

          <div className="weekly-chart">

            {weeklyProgress.map((item) => (
              <div className="week-day" key={item.day}>

                <div className="bar-area">

                  <div
                    className={`week-bar ${
                      item.value === 0 ? "empty-bar" : ""
                    }`}
                    style={{
                      height: `${
                        Math.max(
                          (item.value / maxWeeklyValue) * 100,
                          item.value === 0 ? 0 : 15
                        )
                      }%`,
                    }}
                  >
                    {item.value > 0 && (
                      <span>{item.value}</span>
                    )}
                  </div>

                </div>

                <span className="week-label">
                  {item.day}
                </span>

              </div>
            ))}

          </div>

        </section>

        <div className="dashboard-footer">

          <p>
            Keep showing up. Progress happens one day at a time.
          </p>

          <button onClick={handleSignOut}>
            Sign out
          </button>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;