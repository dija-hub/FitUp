import "./Dashboardnav.css";

function DashboardNav({ activePage, setActivePage }) {
  return (
    <div className="dashboard-nav">
      <span
        className={activePage === "overview" ? "active" : ""}
        onClick={() => setActivePage("overview")}
      >
        Overview
      </span>

      <span
        className={activePage === "focus" ? "active" : ""}
        onClick={() => setActivePage("focus")}
      >
        Focus
      </span>
    </div>
  );
}

export default DashboardNav;