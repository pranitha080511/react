import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./auth.css";

interface AuthPageProps {
  onAuthSuccess?: (user: any) => void;
}

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="auth-wrapper">
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => setIsSignup(false)} className={!isSignup ? "tab-active" : "tab"}>
          Login
        </button>
        <button onClick={() => setIsSignup(true)} className={isSignup ? "tab-active" : "tab"}>
          Sign Up
        </button>
      </div>

      {isSignup ? (
        <Signup onSignupSuccess={(user) => onAuthSuccess?.(user)} />
      ) : (
        <Login onLoginSuccess={(user) => onAuthSuccess?.(user)} />
      )}

      <p
        className="toggle-text"
        style={{ textAlign: "center", marginTop: 12, cursor: "pointer" }}
        onClick={() => setIsSignup((s) => !s)}
      >
        {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default AuthPage;
