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

import "./auth.css";

function Auth({
  setShowSignUp,
  darkMode,
  setIsLoggedIn,
  setShowDashboard,
}) {
  const [isSignUp, setIsSignUp] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (isSignUp && fullName.trim() === "") {
      setError("Please enter your full name.");
      return;
    }

    if (email.trim() === "") {
      setError("Please enter your email.");
      return;
    }

    if (password.trim() === "") {
      setError("Please enter your password.");
      return;
    }

    if (isSignUp && confirmPass.trim() === "") {
      setError("Please confirm your password.");
      return;
    }

    if (isSignUp && password !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    if (isSignUp) {
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            emailRedirectTo: "https://fit-up-rouge.vercel.app",
            data: {
              full_name: fullName.trim(),
            },
          },
        });

      console.log("Signup data:", data);
      console.log("Signup user:", data.user);
      console.log("Signup error:", signUpError);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setSuccessMessage("Account created successfully!");

      setTimeout(() => {
        setIsLoggedIn(true);
        setShowDashboard(true);
        setShowSignUp(false);
      }, 1200);
    } else {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

      console.log("Signin data:", data);
      console.log("Signin error:", signInError);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setSuccessMessage("Signed in successfully!");

      setTimeout(() => {
        setIsLoggedIn(true);
        setShowDashboard(true);
        setShowSignUp(false);
      }, 1200);
    }
  }

  function closeAuth() {
    setShowSignUp(false);
  }

  return (
    <div className={`auth-page ${darkMode ? "auth-dark" : ""}`}>
      <div className="auth-card">

        <button
          type="button"
          className="auth-back-btn"
          onClick={closeAuth}
        >
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
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="eye-icon" />
                ) : (
                  <Eye className="eye-icon" />
                )}
              </button>
            </div>
          )}

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {successMessage && (
            <p className="auth-success">
              {successMessage}
            </p>
          )}

          <button
            className="auth-main-btn"
            type="submit"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </button>

          <div className="divider">
            <span></span>
            <p>or continue with</p>
            <span></span>
          </div>

          <button
            type="button"
            className="google-btn"
          >
            <span className="google-icon">G</span>

            {isSignUp
              ? "Sign up with Google"
              : "Sign in with Google"}
          </button>

          <div className="auth-switch">
            {isSignUp ? (
              <p>
                Already have an account?

                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError("");
                    setSuccessMessage("");
                  }}
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?

                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError("");
                    setSuccessMessage("");
                  }}
                >
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