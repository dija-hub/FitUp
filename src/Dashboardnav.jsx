import {
  LayoutDashboard,
  Timer,
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
        className={activePage === "focus" ? "active" : ""}
        onClick={() => setActivePage("focus")}
      >
        <Timer size={18} />
        Focus
      </button>
    </div>
  );
}

export default DashboardNav;