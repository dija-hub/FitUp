
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
  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>
      <div className="logo">
        <span>✚</span> FitUp
      </div>

      <ul className="nav-links">
        {/* Home */}
        <li>
          <a
            href="#home"
            className={activeSection === "home" ? "active" : ""}
            onClick={() => {
              setActiveSection("home");
              setShowDashboard(false);
            }}
          >
            Home
          </a>
        </li>

        {/* Features */}
        <li>
          <a
            href="#features"
            className={activeSection === "features" ? "active" : ""}
            onClick={() => {
              setActiveSection("features");
              setShowDashboard(false);
            }}
          >
            Features
          </a>
        </li>

        {/* How It Works */}
        <li>
          <a
            href="#work"
            className={activeSection === "work" ? "active" : ""}
            onClick={() => {
              setActiveSection("work");
              setShowDashboard(false);
            }}
          >
            How it works
          </a>
        </li>

        {/* Connect With Us */}
        <li>
          <a
            href="#connect"
            className={activeSection === "connect" ? "active" : ""}
            onClick={() => {
              setActiveSection("connect");
              setShowDashboard(false);
            }}
          >
            Connect with us
          </a>
        </li>

        {/* Dashboard - Only visible when logged in */}
        {isLoggedIn && (
          <li>
            <button
              className="dashboard-nav-btn"
              onClick={() => {
                setShowDashboard(true);
              }}
            >
              Dashboard
            </button>
          </li>
        )}
      </ul>

      <div className="nav-buttons">
        {/* Dark Mode Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`dark-mode-btn ${
            darkMode ? "darkmode" : "lightmode"
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Join Now - Only visible when logged out */}
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

