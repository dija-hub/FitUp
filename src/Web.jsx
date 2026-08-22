import Navbar from "./Navbar";
import "./Web.css";
import {
  Flame,
  Palette,
  Moon,
  TrendingUp
} from "lucide-react";

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

  <div className="features-heading">
    <h2>FEATURES</h2>
    <h3>
      Everything you need,
      <br />
      nothing you don't
    </h3>
  </div>

  <div className="features-content">

    <div className="feature-item">
      <div className="feature-box">

        <div className="feature-icon">
          <Flame size={20} />
        </div>

        <h2>Daily Check-ins</h2>

        <p>
          Keep track of your daily tasks and stay consistent with your habits.
        </p>

      </div>
    </div>


    <div className="feature-item">
      <div className="feature-box">

        <div className="feature-icon">
          <Palette size={20} />
        </div>

        <h2>Habit Color Categories</h2>

        <p>
          Organize your habits with simple colors to quickly see what needs
          your attention.
        </p>

      </div>
    </div>


    <div className="feature-item">
      <div className="feature-box">

        <div className="feature-icon">
          <Moon size={20} />
        </div>

        <h2>Dark Mode</h2>

        <p>
          Switch to a comfortable dark theme for a cleaner experience
          anytime.
        </p>

      </div>
    </div>


    <div className="feature-item">
      <div className="feature-box">

        <div className="feature-icon">
          <TrendingUp size={20} />
        </div>

        <h2>Progress Tracking</h2>

        <p>
          See your completed tasks and track your progress over time.
        </p>

      </div>
    </div>

  </div>

</section>

    </div>
  );
}

export default Web;
