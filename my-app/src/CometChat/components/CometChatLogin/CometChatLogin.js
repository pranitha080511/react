import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import '../../styles/CometChatLogin/CometChatLogin.css';
import cometChatLogo from '../../assets/cometchat_logo.svg';
import cometChatLogoDark from '../../assets/cometchat_logo_dark.svg';
import { CometChatUIKit } from '@cometchat/chat-uikit-react';
import { sampleUsers } from './sampledata';
const CometChatLogin = () => {
    const [defaultUsers, setDefaultUsers] = useState([]);
    const [uid, setUid] = useState('');
    const [selectedUid, setSelectedUid] = useState('');
    const isDarkMode = document.querySelector('[data-theme="dark"]') ? true : false;
    useEffect(() => {
        fetchDefaultUsers();
        return () => {
            setDefaultUsers([]);
        };
    }, []);
    async function fetchDefaultUsers() {
        try {
            const response = await fetch('https://assets.cometchat.io/sampleapp/v2/sampledata.json');
            const data = await response.json();
            setDefaultUsers(data.users);
        }
        catch (error) {
            setDefaultUsers(sampleUsers.users);
            console.error('fetching default users failed, using fallback data', error);
        }
    }
    async function login(uid) {
        setSelectedUid(uid);
        try {
            CometChatUIKit.login(uid)?.then((loggedInUser) => {
                console.log('Login successful, loggedInUser:', loggedInUser);
            });
        }
        catch (error) {
            console.error('login failed', error);
        }
    }
    async function handleLoginWithUidFormSubmit(e) {
        e.preventDefault();
        try {
            await login(uid);
        }
        catch (error) {
            console.error(error);
        }
    }
    function getUserBtnWithKeyAdded({ name, uid, avatar }) {
        return (_jsx(_Fragment, { children: _jsxs("div", { onClick: () => login(uid), className: `cometchat-login__user ${selectedUid === uid ? 'cometchat-login__user-selected ' : ''}`, children: [selectedUid === uid ? (_jsx(_Fragment, { children: _jsx("div", { className: "cometchat-login__user-selection-indicator", children: _jsx("div", { className: "cometchat-login__user-selection-checked" }) }) })) : null, _jsx("img", { src: avatar, alt: `${name}'s avatar`, className: "cometchat-login__user-avatar" }), _jsxs("div", { className: "cometchat-login__user-name-and-uid cometchat-login__user-details", children: [_jsx("div", { className: "cometchat-login__user-name", children: name }), _jsx("div", { className: "cometchat-login__user-uid", children: uid })] })] }, uid) }));
    }
    return (_jsxs("div", { className: "cometchat-login__container", children: [_jsx("div", { className: "cometchat-login__logo", children: isDarkMode ? _jsx("img", { src: cometChatLogoDark, alt: "" }) : _jsx("img", { src: cometChatLogo, alt: "" }) }), _jsxs("div", { className: "cometchat-login__content", children: [_jsxs("div", { className: "cometchat-login__header", children: [_jsx("div", { className: "cometchat-login__title", children: "Sign in to cometchat" }), _jsxs("div", { className: "cometchat-login__sample-users", children: [_jsx("div", { className: "cometchat-login__sample-users-title", children: "Using our sample users" }), _jsx("div", { className: "cometchat-login__user-list", children: defaultUsers.map(getUserBtnWithKeyAdded) })] })] }), _jsxs("div", { className: "cometchat-login__divider-section", style: { display: 'flex' }, children: [_jsx("div", { className: "cometchat-login__divider" }), _jsx("span", { className: "cometchat-login__divider-text", children: " Or" }), _jsx("div", { className: "cometchat-login__divider" })] }), _jsx("div", { className: "cometchat-login__custom-login", children: _jsxs("form", { onSubmit: handleLoginWithUidFormSubmit, className: "cometchat-login__form", children: [_jsxs("div", { className: "cometchat-login__input-group", children: [_jsx("label", { className: "input-label cometchat-login__input-label", htmlFor: "", children: "Your UID" }), _jsx("input", { className: "cometchat-login__input", type: "text", value: uid, onChange: (e) => {
                                                setUid(e.target.value);
                                            }, required: true, placeholder: "Enter your UID" })] }), _jsx("button", { className: "cometchat-login__submit-button", children: "Login" })] }) })] })] }));
};
export default CometChatLogin;
