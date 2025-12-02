import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/auth/Signup.tsx
import { useState } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import { COMETCHAT_CONSTANTS } from "../main";
const Signup = ({ onSignupSuccess }) => {
    const [uid, setUid] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        if (!uid.trim() || !name.trim()) {
            setError("All fields are required");
            return;
        }
        setIsLoading(true);
        try {
            const newUser = new CometChat.User(uid.trim());
            newUser.setName(name.trim());
            await CometChat.createUser(newUser, COMETCHAT_CONSTANTS.AUTH_KEY);
            console.log("Signup successful! user created.");
            // Auto-login the newly created user
            const loggedUser = await CometChatUIKit.login(uid.trim());
            console.log("Auto-login successful after signup:", loggedUser);
            onSignupSuccess?.(loggedUser);
        }
        catch (err) {
            console.error("Signup failed:", err);
            setError(err?.message || "Signup failed. UID may already exist.");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "auth-container", children: [_jsx("h2", { children: "Sign Up" }), _jsxs("form", { onSubmit: handleSignup, children: [_jsx("input", { type: "text", placeholder: "Choose UID", value: uid, onChange: (e) => setUid(e.target.value), className: "auth-input", disabled: isLoading }), _jsx("input", { type: "text", placeholder: "Enter Full Name", value: name, onChange: (e) => setName(e.target.value), className: "auth-input", disabled: isLoading }), _jsx("button", { type: "submit", className: "auth-btn", disabled: isLoading, children: isLoading ? "Creating..." : "Create Account" })] }), error && _jsx("p", { className: "error-text", children: error })] }));
};
export default Signup;
