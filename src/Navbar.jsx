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

    window.location.hash = section;

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
    if (showDashboard) return;

    setShowDashboard(true);
    window.location.hash = "dashboard";
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            className={!showDashboard ? "active" : ""}
            onClick={() => goTo("home")}
          >
            Home
          </button>
        </li>

        <li>
          <button
            onClick={() => goTo("features")}
          >
            Features
          </button>
        </li>

        <li>
          <button
            onClick={() => goTo("how-it-works")}
          >
            How it works
          </button>
        </li>

        <li>
          <button
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