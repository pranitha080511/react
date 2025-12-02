import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { CometChatAvatar, getLocalizedString } from '@cometchat/chat-uikit-react';
import '../../styles/CometChatDetails/CometChatUserDetails.css';
import { useContext } from 'react';
import { useCometChatContext } from '../../context/CometChatContext';
import { AppContext } from '../../context/AppContext';
export const CometChatUserDetails = (props) => {
    const { user, onHide = () => { }, actionItems = [], showStatus, onUserActionClick = () => { } } = props;
    const { chatFeatures } = useCometChatContext();
    const { appState } = useContext(AppContext);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "cometchat-user-details__header", children: [_jsx("div", { className: "cometchat-user-details__header-text", children: getLocalizedString('user_info') }), _jsx("div", { className: "cometchat-user-details__header-icon", onClick: onHide })] }), _jsxs("div", { className: "cometchat-user-details__content", children: [_jsx("div", { className: "cometchat-user-details__content-avatar", children: _jsx(CometChatAvatar, { image: user.getAvatar?.(), name: user.getName() }) }), _jsxs("div", { children: [_jsx("div", { className: "cometchat-user-details__content-title", children: user.getName() }), showStatus && chatFeatures.coreMessagingExperience.userAndFriendsPresence && (_jsx("div", { className: "cometchat-user-details__content-description", children: getLocalizedString('message_header_status_' + user.getStatus?.()) }))] }), _jsx("div", { className: "cometchat-user-details__content-action", children: actionItems.map((actionItem) => (_jsxs("div", { className: `${appState.isFreshChat && actionItem.name === 'Delete Chat' ? 'cometchat-user-details__content-action-item-disabled' : ''} cometchat-user-details__content-action-item`, onClick: () => appState.isFreshChat && actionItem.name === 'Delete Chat' ? () => { } : onUserActionClick(actionItem), children: [_jsx("div", { className: `cometchat-user-details__content-action-item-icon cometchat-user-details__content-action-item-icon-${actionItem.id}`, style: actionItem.icon ? { WebkitMask: `url(${actionItem.icon}), center, center, no-repeat` } : undefined }), _jsx("div", { className: "cometchat-user-details__content-action-item-text", children: actionItem.name })] }, actionItem.name))) })] })] }));
};
