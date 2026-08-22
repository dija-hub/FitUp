import Navbar from "./Navbar";
import "./Web.css";

function Web() {
  return (
    <div>
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <p className="hero-tagline">BUILD STRENGTH. BUILD CONFIDENCE.</p>

          <h1>
            Stronger <span>Every Day</span>
          </h1>

          <p className="hero-description">
            Transform your body, boost your energy, and become the best version
            of yourself.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Get Started</button>

            <button className="secondary-btn">Our Programs</button>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-icon">♙</div>
              <h3>Active</h3>
              <p>Happy Members</p>
            </div>

            <div className="stat">
              <div className="stat-icon">🏋</div>
              <h3>Better</h3>
              <p>Habits</p>
            </div>

            <div className="stat">
              <div className="stat-icon">🔥</div>
              <h3>Focus</h3>
              <p>Categories</p>
            </div>
          </div>
        </div>
      </section>
      <hr />
      <section className="Features">
        <div className="features-content">
          <h1>
            <span>Features</span>
          </h1>
        </div>
      </section>
    </div>
  );
}

export default Web;
