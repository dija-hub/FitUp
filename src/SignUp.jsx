import React from "react";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
   ArrowLeft

} from "lucide-react";
import Navbar from "./Navbar";
import "./SignUp.css";

export default function SignUp({setShowSignUp}) {
  return (

    <div className="signup-page">
      <div className="signup-card">
        <button
  className="signup-back-btn"
  onClick={() => setShowSignUp(false)}
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
              type="password"
              placeholder="Create Password"
            />

            <Eye className="eye-icon" />
          </div>

        
          <div className="input-box">
            <LockKeyhole className="input-icon" />

            <input
              type="password"
              placeholder="Confirm Password"
            />

            <Eye className="eye-icon" />
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