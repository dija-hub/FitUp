import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <span>✚</span> FitUp
      </div>

      <ul className="nav-links">

        <li>
          <a href="#home" className="active">
            Home
          </a>
        </li>

        <li>
          <a href="#about">
            About
          </a>
        </li>

        <li>
          <a href="#programs">
            Programs
          </a>
        </li>

        <li>
          <a href="#services">
            Services
          </a>
        </li>

        <li>
          <a href="#contact">
            Contact
          </a>
        </li>

      </ul>

      <button className="join-btn">
        Join Now
      </button>

    </nav>
  );
}

export default Navbar;