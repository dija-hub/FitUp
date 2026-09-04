import { Sun, Moon } from "lucide-react";
import "./Navbar.css";

function Navbar({
  darkMode,
  setDarkMode,
  onSignOut,
  setShowDashboard,
  showDashboard,
  isLoggedIn,
  setShowSignUp,
  setActiveSection,
}) {
  const goTo = (section) => {
    setShowDashboard(false);

    if (setActiveSection) {
      setActiveSection(section);
    }

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
    if (!isLoggedIn) {
      setShowSignUp(true);
      return;
    }

    setShowDashboard(true);
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>

      <button
        type="button"
        className="logo"
        onClick={() => goTo("home")}
      >
        <span>+</span>
        FitUp
      </button>

      <ul className="nav-links">

        <li>
          <button
            type="button"
            className={`nav-link ${!showDashboard ? "active" : ""}`}
            onClick={() => goTo("home")}
          >
            Home
          </button>
        </li>

        <li>
          <button
            type="button"
            className="nav-link"
            onClick={() => goTo("features")}
          >
            Features
          </button>
        </li>

        <li>
          <button
            type="button"
            className="nav-link"
            onClick={() => goTo("work")}
          >
            How it works
          </button>
        </li>

        <li>
          <button
            type="button"
            className="nav-link"
            onClick={() => goTo("connect")}
          >
            Connect with us
          </button>
        </li>

        <li>
          <button
            type="button"
            className={`nav-link dashboard-nav-btn ${
              showDashboard ? "active" : ""
            }`}
            onClick={handleDashboard}
          >
            Dashboard
          </button>
        </li>

      </ul>

      <div className="nav-buttons">

        {isLoggedIn && (
          <button
            type="button"
            className="signout-nav-btn"
            onClick={onSignOut}
          >
            Sign Out
          </button>
        )}

        <button
          type="button"
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