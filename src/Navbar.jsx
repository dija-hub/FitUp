import "./Navbar.css";
import { Moon } from "lucide-react";
function Navbar({activeSection,setActiveSection}) {
  return (
    

    <nav className="navbar">

      <div className="logo">
        <span>✚</span> FitUp
      </div>

      <ul className="nav-links">

        <li>
          <a href="#home" className={activeSection==="home"?"active":""}onClick={() => setActiveSection("home")}>
            Home
          </a>
        </li>

        <li>
          <a href="#features"className={activeSection==="features"?"active":""}onClick={() => setActiveSection("features")}>
            Features
          </a>
        </li>

        <li>
          <a href="#work"className={activeSection==="work"?"active":""}onClick={() => setActiveSection("work")}>
            How it works
          </a>
        </li>

        <li>
          <a href="#connect"className={activeSection==="connect"?"active":""}onClick={() => setActiveSection("connect")}>
            Connect with us
          </a>
        </li>

      </ul>
<div className="nav-buttons">

  <button className="dark-mode-btn">
    <Moon size={18} />
  </button>

  <button className="join-btn">
    Join Now
  </button>

</div>

    </nav>
  );
}

export default Navbar;