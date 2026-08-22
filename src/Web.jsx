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
<hr/>
<section className="how-it-works">

  <div className="how-heading">
    <p>HOW IT WORKS</p>

    <h1>Start building better habits</h1>

    <span>
      Simple steps to turn small actions into lasting routines.
    </span>
  </div>


  <div className="steps">

    
    <div className="step">

      <div className="step-number">
        01
      </div>

      <div className="step-box">

        <div className="step-icon">
          ✓
        </div>

        <div>
          <h2>Create</h2>
          <p>Build your habits</p>
        </div>

      </div>

    </div>


    <div className="step-arrow">
      →
    </div>


    
    <div className="step">

      <div className="step-number">
        02
      </div>

      <div className="step-box">

        <div className="step-icon">
          ↗
        </div>

        <div>
          <h2>Track</h2>
          <p>Stay consistent</p>
        </div>

      </div>

    </div>


    <div className="step-arrow">
      →
    </div>


    
    <div className="step">

      <div className="step-number">
        03
      </div>

      <div className="step-box">

        <div className="step-icon">
          ★
        </div>

        <div>
          <h2>Improve</h2>
          <p>Become your best</p>
        </div>

      </div>

    </div>

  </div>

</section>
<section className="reviews">

  <div className="reviews-heading">
    <p>WHAT PEOPLE SAY</p>

    <h1>
      Built for better
      <span> everyday habits.</span>
    </h1>

    <p className="reviews-subtitle">
      Real people. Real habits. Real progress.
    </p>
  </div>


  <div className="reviews-container">

    {/* Review 1 */}
    <div className="review-card">

      <div className="review-stars">
        ★★★★★
      </div>

      <p className="review-text">
        "This app made staying consistent so much easier.
        I love being able to see my progress every day."
      </p>

      <div className="review-user">

        <div className="user-avatar">
          A
        </div>

        <div>
          <h3>Alex Morgan</h3>
          <p>Fitness Enthusiast</p>
        </div>

      </div>

    </div>


    {/* Review 2 */}
    <div className="review-card featured-review">

      <div className="review-stars">
        ★★★★★
      </div>

      <p className="review-text">
        "Simple, clean, and actually motivating.
        I've finally turned my small habits into a routine."
      </p>

      <div className="review-user">

        <div className="user-avatar">
          S
        </div>

        <div>
          <h3>Sarah Wilson</h3>
          <p>Daily User</p>
        </div>

      </div>

    </div>


    {/* Review 3 */}
    <div className="review-card">

      <div className="review-stars">
        ★★★★★
      </div>

      <p className="review-text">
        "The progress tracking keeps me motivated.
        Every completed habit feels like a small win."
      </p>

      <div className="review-user">

        <div className="user-avatar">
          J
        </div>

        <div>
          <h3>James Carter</h3>
          <p>Habit Builder</p>
        </div>

      </div>

    </div>

  </div>

</section>

    </div>
  );
}

export default Web;
