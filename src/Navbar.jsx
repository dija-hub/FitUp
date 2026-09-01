import "./Navbar.css";
import { Moon, Sun } from "lucide-react";

function Navbar({
  activeSection,
  setActiveSection,
  darkMode,
  setDarkMode,
  setShowSignUp,
  isLoggedIn,
  setShowDashboard,
}) {
  function goToSection(section) {
    setActiveSection(section);
    setShowDashboard(false);
  }

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>
      <div
        className="logo"
        onClick={() => goToSection("home")}
      >
        <span>✚</span> FitUp
      </div>

      <ul className="nav-links">
        <li>
          <a
            href="#home"
            className={activeSection === "home" ? "active" : ""}
            onClick={() => goToSection("home")}
          >
            Home
          </a>
        </li>

        <li>
          <a
            href="#features"
            className={activeSection === "features" ? "active" : ""}
            onClick={() => goToSection("features")}
          >
            Features
          </a>
        </li>

        <li>
          <a
            href="#work"
            className={activeSection === "work" ? "active" : ""}
            onClick={() => goToSection("work")}
          >
            How it works
          </a>
        </li>

        <li>
          <a
            href="#connect"
            className={activeSection === "connect" ? "active" : ""}
            onClick={() => goToSection("connect")}
          >
            Connect with us
          </a>
        </li>

        {isLoggedIn && (
          <li>
            <button
              className={`dashboard-nav-btn ${
                showDashboard ? "active-dashboard" : ""
              }`}
              onClick={() => {
                setShowDashboard(true);
                setActiveSection("");
              }}
            >
              Dashboard
            </button>
          </li>
        )}
      </ul>

      <div className="nav-buttons">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`dark-mode-btn ${
            darkMode ? "darkmode" : "lightmode"
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {!isLoggedIn && (
          <button
            className="join-btn"
            onClick={() => setShowSignUp(true)}
          >
            Join Now
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;