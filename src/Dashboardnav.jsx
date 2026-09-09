
import {
  LayoutDashboard,
  CalendarDays,
  Timer,
  BarChart3,
  Target,
  Settings,
} from "lucide-react";
import "./DashboardNav.css";

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
        className={activePage === "calendar" ? "active" : ""}
        onClick={() => setActivePage("calendar")}
      >
        <CalendarDays size={18} />
        Calendar
      </button>

      <button
        className={activePage === "focus" ? "active" : ""}
        onClick={() => setActivePage("focus")}
      >
        <Timer size={18} />
        Focus
      </button>

      <button
        className={activePage === "analytics" ? "active" : ""}
        onClick={() => setActivePage("analytics")}
      >
        <BarChart3 size={18} />
        Analytics
      </button>

      <button
        className={activePage === "goals" ? "active" : ""}
        onClick={() => setActivePage("goals")}
      >
        <Target size={18} />
        Goals
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

