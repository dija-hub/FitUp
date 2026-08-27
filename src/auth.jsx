import { useState } from "react";
import { supabase } from "./utils/supabase";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

import "./Auth.css";

function Auth({ setShowSignUp, darkMode }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setErrorMessage("");

    if (fullName.trim() === "") {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (email.trim() === "") {
      console.log("Please enter the Email");
      return;
    }

    if (password.trim() === "") {
      console.log("Please enter the  password");
      return;
    }

    if (confirmPass.trim() === "") {
      console.log("Please enter confirm your password");
      return;
    }
    if (password !== confirmPass) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    console.log("validation allows it to continue");

    const { error, data } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });
    if (error) {
      console.log(error);
      return;
    }
    {
      errorMessage && <p className="auth-error">{errorMessage}</p>;
    }

    console.log("Sign Up is successfull");
  }

  return (
    <div className={`auth-page ${darkMode ? "auth-dark" : ""}`}>
      <div className="auth-card">
        <button className="auth-back-btn" onClick={() => setShowSignUp(false)}>
          <ArrowLeft size={21} />
        </button>

        <div className="auth-heading">
          <p className="auth-label">
            {isSignUp ? "START YOUR JOURNEY" : "WELCOME BACK"}
          </p>

          <h1>
            {isSignUp ? (
              <>
                Create your <span>account</span>
              </>
            ) : (
              <>
                Welcome <span>back</span>
              </>
            )}
          </h1>

          <p>
            {isSignUp
              ? "Start building better habits and make progress every day."
              : "Sign in and continue building better habits."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="input-box">
              <UserRound className="input-icon" />

              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="input-box">
            <Mail className="input-icon" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-box">
            <LockKeyhole className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="eye-icon" />
              ) : (
                <Eye className="eye-icon" />
              )}
            </button>
          </div>

          {isSignUp && (
            <div className="input-box">
              <LockKeyhole className="input-icon" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />

              <button
                type="button"
                className="password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="eye-icon" />
                ) : (
                  <Eye className="eye-icon" />
                )}
              </button>
            </div>
          )}

          <button className="auth-main-btn" type="submit">
            {isSignUp ? "Create Account" : "Sign In"}
          </button>

          <div className="divider">
            <span></span>
            <p>or continue with</p>
            <span></span>
          </div>

          <button className="google-btn">
            <span className="google-icon">G</span>

            {isSignUp ? "Sign up with Google" : "Sign in with Google"}
          </button>

          <div className="auth-switch">
            {isSignUp ? (
              <p>
                Already have an account?
                <button type="button" onClick={() => setIsSignUp(false)}>
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?
                <button type="button" onClick={() => setIsSignUp(true)}>
                  Sign up
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;
