import Navbar from "./Navbar";
import "./Web.css";
import {
  Flame,
  Palette,
  Moon,
  TrendingUp,
  ArrowDown 
} from "lucide-react";

function Web() {
  return (
    <div>
      <Navbar />

      <section className="hero" id="home">
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
          </div>
        </div>
        

      </section>
     

      <hr />
      <section className="Features" id="features">

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
<section className="how-it-works" id="work">

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

 <section className="final-cta" id="connect with us">

      <div className="cta-wrapper">

        <div className="orange-orb orb-one"></div>
        <div className="orange-orb orb-two"></div>

        
        <div className="corner-line line-one"></div>
        <div className="corner-line line-two"></div>

        <div className="cta-inner">

          <div className="cta-label">
            <span className="label-dot"></span>
            START YOUR JOURNEY
          </div>

          <h2>
            Ready to build
            <br />
            <span>better habits?</span>
          </h2>

          <p>
            Join thousands of people building consistency,
            creating better routines, and making progress
            every single day.
          </p>

          <button className="cta-button">
            Get started 
            <span>→</span>
          </button>

          <div className="cta-note">
            <span>✦</span>
            Free forever · No credit card required
          </div>

        </div>
      </div>

      <footer className="cta-footer">

        <div className="brand">
          <div className="brand-icon">✚</div>
          <span>FitUp</span>
        </div>

        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#reviews">Reviews</a>
          <a href="#signin">Sign in</a>
        </div>

        <p>© 2026 FitUp</p>

      </footer>

    </section>
    </div>
  );
}

export default Web;
