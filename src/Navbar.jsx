import "./Navbar.css";
import { Moon, Sun } from "lucide-react";

function Navbar({
  activeSection,
  setActiveSection,
  darkMode,
  setDarkMode,
  setShowSignUp,
}) {
  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>
      <div className="logo">
        <span>✚</span> FitUp
      </div>

      <ul className="nav-links">
        <li>
          <a
            href="#home"
            className={activeSection === "home" ? "active" : ""}
            onClick={() => setActiveSection("home")}
          >
            Home
          </a>
        </li>

        <li>
          <a
            href="#features"
            className={activeSection === "features" ? "active" : ""}
            onClick={() => setActiveSection("features")}
          >
            Features
          </a>
        </li>

        <li>
          <a
            href="#work"
            className={activeSection === "work" ? "active" : ""}
            onClick={() => setActiveSection("work")}
          >
            How it works
          </a>
        </li>

        <li>
          <a
            href="#connect"
            className={activeSection === "connect" ? "active" : ""}
            onClick={() => setActiveSection("connect")}
          >
            Connect with us
          </a>
        </li>
        <li>
          <a
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/dashboard";
            }}
          >
            Dashboard
          </a>
        </li>
      </ul>

      <div className="nav-buttons">
        <button
          onClick={() => {
            setDarkMode(!darkMode);
          }}
          className={`dark-mode-btn ${darkMode ? "darkmode" : "lightmode"}`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="join-btn" onClick={() => setShowSignUp(true)}>
          Join Now
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
