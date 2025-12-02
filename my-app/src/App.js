import { jsx as _jsx } from "react/jsx-runtime";
// src/App.tsx
import CometChatApp from "./CometChat/CometChatApp";
const App = () => {
    return (_jsx("div", { style: { width: "100vw", height: "100vh" }, children: _jsx(CometChatApp, {}) }));
};
export default App;
