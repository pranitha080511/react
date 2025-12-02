import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CometChatButton, getLocalizedString } from '@cometchat/chat-uikit-react';
import '../../styles/CometChatAlertPopup/CometChatAlertPopup.css';
export const CometChatAlertPopup = (props) => {
    const { onConfirmClick, title, description } = props;
    return (_jsx("div", { className: "cometchat-alert-popup__backdrop", children: _jsx("div", { className: "cometchat-alert-popup-wrapper", children: _jsxs("div", { className: "cometchat-alert-popup", children: [_jsx("div", { className: "cometchat-alert-popup__icon-wrapper", children: _jsx("div", { className: "cometchat-alert-popup__icon" }) }), _jsxs("div", { className: "cometchat-alert-popup__text", children: [_jsx("div", { className: "cometchat-alert-popup__text-title", children: title }), _jsx("div", { className: "cometchat-alert-popup__text-subtitle", children: description })] }), _jsx("div", { className: "cometchat-alert-popup__button-wrapper", children: _jsx(CometChatButton, { text: getLocalizedString('understood'), onClick: onConfirmClick }) })] }) }) }));
};
