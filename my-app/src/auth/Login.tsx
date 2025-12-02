// src/auth/Login.tsx

import { useState } from "react";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";

interface LoginProps {
  onLoginSuccess?: (user: any) => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [uid, setUid] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!uid.trim()) {
      setError("UID is required");
      return;
    }

    setIsLoading(true);
    try {
      const user = await CometChatUIKit.login(uid.trim());
      console.log("Login Successful:", user);
      onLoginSuccess?.(user);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err?.message || "Invalid UID or user not registered!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter UID"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className="auth-input"
          disabled={isLoading}
        />

        <button type="submit" className="auth-btn" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default Login;
