import Navbar from "./Navbar";
import "./Web.css";

function Web() {
  return (
    <div>
      <Navbar />

      <section className="hero">
        <div className="hero-content">

          <p className="hero-tagline">
            BUILD STRENGTH. BUILD CONFIDENCE.
          </p>

          <h1>
            Stronger <span>Every Day</span>
          </h1>

          <p className="hero-description">
            Transform your body, boost your energy, and
            become the best version of yourself.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              Get Started
            </button>

            <button className="secondary-btn">
              Our Programs
            </button>
          </div>

          <div className="stats">

            <div className="stat">
              <div className="stat-icon">♙</div>
              <h3>500+</h3>
              <p>Happy Members</p>
            </div>

            <div className="stat">
              <div className="stat-icon">🏋</div>
              <h3>25+</h3>
              <p>Expert Trainers</p>
            </div>

            <div className="stat">
              <div className="stat-icon">🔥</div>
              <h3>30+</h3>
              <p>Fitness Programs</p>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}

export default Web;