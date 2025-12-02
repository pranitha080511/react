import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import cometChatLogo from '../../assets/cometchat_logo.svg';
import cometChatLogoDark from '../../assets/cometchat_logo_dark.svg';
import usIcon from '../../assets/us-icon.svg';
import euIcon from '../../assets/eu-icon.svg';
import inIcon from '../../assets/in-icon.svg';
import '../../styles/CometChatLogin/CometChatAppCredentials.css';
import { CometChatUIKit, UIKitSettingsBuilder } from '@cometchat/chat-uikit-react';
const CometChatAppCredentials = () => {
    const isDarkMode = document.querySelector('[data-theme="dark"]') ? true : false;
    const [region, setRegion] = useState('us');
    const [appId, setAppId] = useState('');
    const [authKey, setAuthKey] = useState('');
    async function handleSubmit(e) {
        e.preventDefault();
        localStorage.setItem('region', region);
        localStorage.setItem('appId', appId);
        localStorage.setItem('authKey', authKey);
        if (appId && region && authKey) {
            const uiKitSettings = new UIKitSettingsBuilder()
                .setAppId(appId)
                .setRegion(region)
                .setAuthKey(authKey)
                .subscribePresenceForAllUsers()
                .build();
            await CometChatUIKit.init(uiKitSettings);
        }
    }
    return (_jsxs("div", { className: "cometchat-credentials__page", children: [_jsx("div", { className: "cometchat-credentials__logo", children: isDarkMode ? _jsx("img", { src: cometChatLogoDark, alt: "" }) : _jsx("img", { src: cometChatLogo, alt: "" }) }), _jsxs("div", { className: "cometchat-credentials__container", children: [_jsx("div", { className: "cometchat-credentials__header", children: _jsx("div", { className: "cometchat-credentials__title", children: "App Credentials" }) }), _jsxs("form", { onSubmit: handleSubmit, className: "cometchat-credentials__form", children: [_jsxs("div", { className: "cometchat-credentials__form-group", children: [_jsx("div", { className: "cometchat-credentials__form-label", children: "Region" }), _jsxs("div", { className: "cometchat-credentials__region-wrapper", children: [_jsxs("div", { onClick: () => setRegion('us'), className: `cometchat-credentials__region ${region === 'us' ? 'cometchat-credentials__region-selected' : ' '}`, children: [_jsx("img", { src: usIcon, alt: "" }), _jsx("div", { className: "cometchat-credentials__region-text", children: "US" })] }), _jsxs("div", { onClick: () => setRegion('eu'), className: `cometchat-credentials__region ${region === 'eu' ? 'cometchat-credentials__region-selected' : ' '}`, children: [_jsx("img", { src: euIcon, alt: "" }), _jsx("div", { className: "cometchat-credentials__region-text", children: "EU" })] }), _jsxs("div", { onClick: () => setRegion('in'), className: `cometchat-credentials__region ${region === 'in' ? 'cometchat-credentials__region-selected' : ' '}`, children: [_jsx("img", { src: inIcon, alt: "" }), _jsx("div", { className: "cometchat-credentials__region-text", children: "IN" })] })] })] }), _jsxs("div", { className: "cometchat-credentials__form-group", children: [_jsx("label", { className: "cometchat-credentials__form-label", htmlFor: "name", children: "APP ID" }), _jsx("input", { className: "cometchat-credentials__form-input", type: "text", id: "name", placeholder: "Enter the app ID", value: appId, onChange: (e) => setAppId(e.target.value), required: true })] }), _jsxs("div", { className: "cometchat-credentials__form-group", children: [_jsx("label", { className: "cometchat-credentials__form-label", htmlFor: "uid", children: "Auth Keys" }), _jsx("input", { className: "cometchat-credentials__form-input", type: "text", id: "uid", placeholder: "Enter the auth key", value: authKey, onChange: (e) => setAuthKey(e.target.value), required: true })] }), _jsx("button", { className: "cometchat-credentials__button", type: "submit", children: "Continue" })] })] })] }));
};
export default CometChatAppCredentials;
