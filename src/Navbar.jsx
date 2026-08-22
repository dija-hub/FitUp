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
          <a href="#features">
            Features
          </a>
        </li>

        <li>
          <a href="#work">
            How it works
          </a>
        </li>

        <li>
          <a href="#connect with us">
            Connect with us
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