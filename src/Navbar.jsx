import { Sun, Moon } from "lucide-react";
import "./Navbar.css";

function Navbar({
  activeSection,
  setActiveSection,
  darkMode,
  setDarkMode,
  setShowSignUp,
  isLoggedIn,
  setIsLoggedIn,
  showDashboard,
  setShowDashboard,
  onSignOut,
}) {
  const goTo = (section) => {
    setShowDashboard(false);
    setActiveSection(section);

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

    setShowSignUp(false);
    setActiveSection("dashboard");
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
            className={`nav-link ${
              activeSection === "home" && !showDashboard
                ? "active"
                : ""
            }`}
            onClick={() => goTo("home")}
          >
            Home
          </button>
        </li>

        <li>
          <button
            type="button"
            className={`nav-link ${
              activeSection === "features" && !showDashboard
                ? "active"
                : ""
            }`}
            onClick={() => goTo("features")}
          >
            Features
          </button>
        </li>

        <li>
          <button
            type="button"
            className={`nav-link ${
              activeSection === "work" && !showDashboard
                ? "active"
                : ""
            }`}
            onClick={() => goTo("work")}
          >
            How it works
          </button>
        </li>

        <li>
          <button
            type="button"
            className={`nav-link ${
              activeSection === "connect" && !showDashboard
                ? "active"
                : ""
            }`}
            onClick={() => goTo("connect")}
          >
            Connect with us
          </button>
        </li>

        {isLoggedIn && (
          <li>
            <button
              type="button"
              className={`dashboard-nav-btn ${
                activeSection === "dashboard"
                  ? "active"
                  : ""
              }`}
              onClick={handleDashboard}
            >
              Dashboard
            </button>
          </li>
        )}

      </ul>

     <div className="nav-buttons">
{isLoggedIn ? (
  <button
    type="button"
    className="signout-nav-btn"
    onClick={onSignOut}
  >
    Sign Out
  </button>
) : (
  <button
    type="button"
    className="join-btn"
    onClick={() => setShowSignUp(true)}
  >
    Join Now
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
    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
  </button>

</div>

    </nav>
  );
}

export default Navbar;