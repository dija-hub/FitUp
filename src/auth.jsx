import { useState } from "react";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  ArrowLeft
} from "lucide-react";

import "./Auth.css";

function Auth({ setShowSignUp }) {

  const [isSignUp, setIsSignUp] = useState(true);

  return (

    <div className="auth-page">

      <div className="auth-card">

        <button
          className="auth-back-btn"
          onClick={() => setShowSignUp(false)}
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
              : "Sign in and continue building better habits."
            }
          </p>

        </div>


        <div className="auth-form">

          {isSignUp && (

            <div className="input-box">

              <UserRound className="input-icon" />

              <input
                type="text"
                placeholder="Full Name"
              />

            </div>

          )}


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
              placeholder="Password"
            />

            <Eye className="eye-icon" />

          </div>


          {isSignUp && (

            <div className="input-box">

              <LockKeyhole className="input-icon" />

              <input
                type="password"
                placeholder="Confirm Password"
              />

              <Eye className="eye-icon" />

            </div>

          )}


          <button className="auth-main-btn">

            {isSignUp
              ? "Create Account"
              : "Sign In"
            }

          </button>


          <div className="divider">

            <span></span>

            <p>or continue with</p>

            <span></span>

          </div>


          <button className="google-btn">

            <span className="google-icon">
              G
            </span>

            {isSignUp
              ? "Sign up with Google"
              : "Sign in with Google"
            }

          </button>


          <div className="auth-switch">

            {isSignUp ? (

              <p>
                Already have an account?

                <button
                  onClick={() => setIsSignUp(false)}
                >
                  Sign in
                </button>

              </p>

            ) : (

              <p>
                Don't have an account?

                <button
                  onClick={() => setIsSignUp(true)}
                >
                  Sign up
                </button>

              </p>

            )}

          </div>

        </div>

      </div>

    </div>

  );
}

export default Auth;