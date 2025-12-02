import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/auth/Login.tsx
import { useState } from "react";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
const Login = ({ onLoginSuccess }) => {
    const [uid, setUid] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleLogin = async (e) => {
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
        }
        catch (err) {
            console.error("Login failed:", err);
            setError(err?.message || "Invalid UID or user not registered!");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "auth-container", children: [_jsx("h2", { children: "Login" }), _jsxs("form", { onSubmit: handleLogin, children: [_jsx("input", { type: "text", placeholder: "Enter UID", value: uid, onChange: (e) => setUid(e.target.value), className: "auth-input", disabled: isLoading }), _jsx("button", { type: "submit", className: "auth-btn", disabled: isLoading, children: isLoading ? "Logging in..." : "Login" })] }), error && _jsx("p", { className: "error-text", children: error })] }));
};
export default Login;
