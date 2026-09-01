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
  function goHome() {
    setShowDashboard(false);
    setActiveSection("home");

    setTimeout(() => {
      document.getElementById("home")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  }

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>
      <button className="logo" onClick={goHome}>
        <span>✚</span> FitUp
      </button>

      <ul className="nav-links">
        <li>
          <a
            href="#home"
            className={activeSection === "home" && !isLoggedIn ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              goHome();
            }}
          >
            Home
          </a>
        </li>

        <li>
          <a
            href="#features"
            className={activeSection === "features" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setShowDashboard(false);
              setActiveSection("features");

              document.getElementById("features")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Features
          </a>
        </li>

        <li>
          <a
            href="#work"
            className={activeSection === "work" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setShowDashboard(false);
              setActiveSection("work");

              document.getElementById("work")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            How it works
          </a>
        </li>

        <li>
          <a
            href="#connect"
            className={activeSection === "connect" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setShowDashboard(false);
              setActiveSection("connect");

              document.getElementById("connect")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Connect with us
          </a>
        </li>

        {isLoggedIn && (
          <li>
            <button
              className={`dashboard-nav-btn ${
                activeSection === "dashboard" ? "active" : ""
              }`}
              onClick={() => {
                setShowDashboard(true);
                setActiveSection("dashboard");
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