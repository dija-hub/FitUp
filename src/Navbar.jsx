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
    window.location.hash = section;
  };

  const handleDashboard = () => {
    if (setShowDashboard) {
      setShowDashboard(true);
    }

    window.location.href = "/#dashboard";
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>

      <div className="logo" onClick={() => goTo("home")}>
        <span>+</span>
        FitUp
      </div>

      <ul className="nav-links">

        <li>
          <a
            href="#home"
            className={!showDashboard ? "active" : ""}
            onClick={() => goTo("home")}
          >
            Home
          </a>
        </li>

        <li>
          <a href="#features" onClick={() => goTo("features")}>
            Features
          </a>
        </li>

        <li>
          <a href="#how-it-works" onClick={() => goTo("how-it-works")}>
            How it works
          </a>
        </li>

        <li>
          <a href="#connect" onClick={() => goTo("connect")}>
            Connect with us
          </a>
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