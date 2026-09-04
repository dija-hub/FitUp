import { Sun, Moon } from "lucide-react";
import "./Navbar.css";

function Navbar({
  darkMode,
  setDarkMode,
  onSignOut,
  setShowDashboard,
  showDashboard,
}) {
  const goTo = (section) => {
    setShowDashboard(false);

    setTimeout(() => {
      const element = document.getElementById(section);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);
  };

  const handleDashboard = () => {
    setShowDashboard(true);
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>

      <div
        className="logo"
        onClick={() => goTo("home")}
      >
        <span>+</span>
        FitUp
      </div>

      <ul className="nav-links">

        <li>
          <button
            className={`nav-link-btn ${!showDashboard ? "active" : ""}`}
            onClick={() => goTo("home")}
          >
            Home
          </button>
        </li>

        <li>
          <button
            className="nav-link-btn"
            onClick={() => goTo("features")}
          >
            Features
          </button>
        </li>

        <li>
          <button
            className="nav-link-btn"
            onClick={() => goTo("work")}
          >
            How it works
          </button>
        </li>

        <li>
          <button
            className="nav-link-btn"
            onClick={() => goTo("connect")}
          >
            Connect with us
          </button>
        </li>

        <li>
          <button
            className={`dashboard-nav-btn ${
              showDashboard ? "active" : ""
            }`}
            onClick={handleDashboard}
          >
            Dashboard
          </button>
        </li>

      </ul>

      <div className="nav-buttons">

        <button
          className="signout-nav-btn"
          onClick={onSignOut}
        >
          Sign Out
        </button>

        <button
          className={`dark-mode-btn ${
            darkMode ? "darkmode" : "lightmode"
          }`}
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

      </div>

    </nav>
  );
}

export default Navbar;