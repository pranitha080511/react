import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./auth.css";
const AuthPage = ({ onAuthSuccess }) => {
    const [isSignup, setIsSignup] = useState(false);
    return (_jsxs("div", { className: "auth-wrapper", children: [_jsxs("div", { style: { display: "flex", justifyContent: "center", gap: 12, marginBottom: 16 }, children: [_jsx("button", { onClick: () => setIsSignup(false), className: !isSignup ? "tab-active" : "tab", children: "Login" }), _jsx("button", { onClick: () => setIsSignup(true), className: isSignup ? "tab-active" : "tab", children: "Sign Up" })] }), isSignup ? (_jsx(Signup, { onSignupSuccess: (user) => onAuthSuccess?.(user) })) : (_jsx(Login, { onLoginSuccess: (user) => onAuthSuccess?.(user) })), _jsx("p", { className: "toggle-text", style: { textAlign: "center", marginTop: 12, cursor: "pointer" }, onClick: () => setIsSignup((s) => !s), children: isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up" })] }));
};
export default AuthPage;
