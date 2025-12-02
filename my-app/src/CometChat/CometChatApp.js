import { jsx as _jsx } from "react/jsx-runtime";
// src/CometChat/CometChatApp.tsx
import "./styles/CometChatApp.css";
import { AppContextProvider } from "./context/AppContext";
import { CometChatHome } from "./components/CometChatHome/CometChatHome";
import { useEffect, useState } from "react";
import { useCometChatContext } from "./context/CometChatContext";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import useSystemColorScheme from "./customHooks";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import "@cometchat/chat-uikit-react/css-variables.css";
import useThemeStyles from "./customHook/useThemeStyles";
// Authentication screen
import AuthPage from "../auth/AuthPage";
function CometChatApp({ user, group, showGroupActionMessages }) {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const { styleFeatures, setStyleFeatures } = useCometChatContext();
    const systemTheme = useSystemColorScheme();
    useThemeStyles(styleFeatures, systemTheme, setStyleFeatures, loggedInUser);
    /** Add login/logout listener */
    useEffect(() => {
        CometChat.addLoginListener("sample-login-listener", new CometChat.LoginListener({
            loginSuccess: (user) => {
                setLoggedInUser(user);
            },
            logoutSuccess: () => {
                setLoggedInUser(null);
            },
        }));
        return () => CometChat.removeLoginListener("sample-login-listener");
    }, []);
    /** Check if already logged in */
    useEffect(() => {
        CometChatUIKit.getLoggedinUser().then((user) => {
            if (user)
                setLoggedInUser(user);
            else
                setLoggedInUser(null);
        });
    }, []);
    return (_jsx("div", { className: "CometChatApp", children: _jsx(AppContextProvider, { children: loggedInUser ? (_jsx(CometChatHome, { defaultGroup: group, defaultUser: user, showGroupActionMessages: showGroupActionMessages })) : (_jsx(AuthPage, { onAuthSuccess: (u) => setLoggedInUser(u) })) }) }));
}
export default CometChatApp;
