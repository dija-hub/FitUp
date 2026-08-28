import { useState } from "react";
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

function Dashboard() {
  const [taskInput, setTaskInput] = useState("");

  const tasks = [
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
  ];

  return (
    <main className="dashboard">
      <section className="dashboard-top">
        <div className="date-box">
          <CalendarDays size={24} />
          <div>
            <p>May 24, 2025</p>
            <span>Saturday</span>
          </div>
        </div>

        <div className="greeting">
          <h1>Good morning, Khadija! 👋</h1>
          <p>Let's make today productive.</p>
        </div>

        <div className="time-box">
          <span>☀️</span>
          <p>8:45 AM</p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card total-card">
          <div className="stat-icon">
            <ClipboardList size={26} />
          </div>
          <div>
            <p>All Tasks</p>
            <h2>28</h2>
          </div>
        </div>

        <div className="stat-card done-card">
          <div className="stat-icon">
            <CheckCircle2 size={26} />
          </div>
          <div>
            <p>Done</p>
            <h2>18</h2>
          </div>
        </div>

        <div className="stat-card progress-card">
          <div className="stat-icon">
            <Clock3 size={26} />
          </div>
          <div>
            <p>In Progress</p>
            <h2>6</h2>
          </div>
        </div>

        <div className="stat-card pending-card">
          <div className="stat-icon">
            <CalendarClock size={26} />
          </div>
          <div>
            <p>Pending</p>
            <h2>4</h2>
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
              />

              <button>
                <Plus size={20} />
                Add Task
              </button>
            </div>
          </div>

          <div className="tasks-card">
            <h2>My Tasks</h2>

            <div className="task-list">
              {tasks.map((task) => (
                <div className="task-item" key={task.id}>
                  <div className={`task-line ${task.color}`}></div>

                  <input
                    type="checkbox"
                    defaultChecked={task.completed}
                  />

                  <p className={task.completed ? "completed-task" : ""}>
                    {task.name}
                  </p>

                  <span className={`category ${task.color}`}>
                    {task.category}
                  </span>

                  <button className="task-menu">•••</button>
                </div>
              ))}
            </div>

            <div className="task-bottom">
              <p>{tasks.length} tasks</p>

              <button className="clear-btn">
                Clear completed
                <Trash2 size={17} />
              </button>
            </div>
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
                <strong>60%</strong>
              </div>
            </div>

            <div className="completion-text">
              <h3>3 of 5 tasks</h3>
              <p>completed</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;