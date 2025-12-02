import { jsx as _jsx } from "react/jsx-runtime";
// src/main.tsx
import ReactDOM from "react-dom/client";
import App from "./App";
import { UIKitSettingsBuilder, CometChatUIKit, } from "@cometchat/chat-uikit-react";
import { setupLocalization } from "./CometChat/utils/utils";
import { CometChatProvider } from "./CometChat/context/CometChatContext";
export const COMETCHAT_CONSTANTS = {
    APP_ID: "167222890ecea157e",
    REGION: "in",
    AUTH_KEY: "f1c870cac1c6888c577025ac7156b5e96da2abfd",
};
const uiKitSettings = new UIKitSettingsBuilder()
    .setAppId(COMETCHAT_CONSTANTS.APP_ID)
    .setRegion(COMETCHAT_CONSTANTS.REGION)
    .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
    .subscribePresenceForAllUsers()
    .build();
CometChatUIKit.init(uiKitSettings)?.then(() => {
    setupLocalization();
    ReactDOM.createRoot(document.getElementById("root")).render(_jsx(CometChatProvider, { children: _jsx(App, {}) }));
});
