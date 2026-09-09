import {
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Settings,
} from "lucide-react";
import "./Dashboardnav.css";

function DashboardNav({ activePage, setActivePage }) {
  return (
    <div className="dashboard-nav">
      <button
        className={activePage === "overview" ? "active" : ""}
        onClick={() => setActivePage("overview")}
      >
        <LayoutDashboard size={18} />
        Overview
      </button>

      <button
        className={activePage === "tasks" ? "active" : ""}
        onClick={() => setActivePage("tasks")}
      >
        <ListTodo size={18} />
        Tasks
      </button>

      <button
        className={activePage === "progress" ? "active" : ""}
        onClick={() => setActivePage("progress")}
      >
        <BarChart3 size={18} />
        Progress
      </button>

      <button
        className={activePage === "settings" ? "active" : ""}
        onClick={() => setActivePage("settings")}
      >
        <Settings size={18} />
        Settings
      </button>
    </div>
  );
}

export default DashboardNav;