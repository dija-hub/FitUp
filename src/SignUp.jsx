import React, { useState } from "react";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import "./SignUp.css";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="signup-page">
      <div className="signup-card">

        <button
          className="signup-back-btn"
          onClick={() => (window.location.href = "/Web")}
        >
          <ArrowLeft size={22} />
        </button>

        <div className="signup-heading">
          <h1>
            Create Your <span>Account</span>
          </h1>

          <p>
            Join FitUp and start building better habits
            <br />
            every day.
          </p>
        </div>

        <div className="signup-form">

          <div className="input-box">
            <UserRound className="input-icon" />

            <input
              type="text"
              placeholder="Full Name"
            />
          </div>

          <div className="input-box">
            <Mail className="input-icon" />

            <input
              type="email"
              placeholder="Email Address"
            />
          </div>

          <div className="input-box">
            <LockKeyhole className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
            />

            <button
              type="button"
              className="password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <Eye className="eye-icon" />
              ) : (
                <EyeOff className="eye-icon" />
              )}
            </button>
          </div>

          <div className="input-box">
            <LockKeyhole className="input-icon" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
            />

            <button
              type="button"
              className="password-btn"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
            >
              {showConfirmPassword ? (
                <Eye className="eye-icon" />
              ) : (
                <EyeOff className="eye-icon" />
              )}
            </button>
          </div>

          <button className="create-account-btn">
            Create Account
          </button>

          <div className="divider">
            <span></span>
            <p>or sign up with</p>
            <span></span>
          </div>

          <div className="social-buttons">
            <button className="social-btn">
              <span className="google">G</span>
              Google
            </button>
          </div>

          <p className="login-text">
            Already have an account?
            <a href="#"> Log in</a>
          </p>

        </div>
      </div>
    </div>
  );
}