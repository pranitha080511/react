import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getLocalizedString } from '@cometchat/chat-uikit-react';
import '../../styles/CometChatMessages/CometChatEmptyStateView.css';
export const CometChatEmptyStateView = (props) => {
    const { activeTab } = props;
    return (_jsxs("div", { className: "cometchat-empty-state-view", children: [_jsx("div", { className: activeTab !== 'calls' ? 'cometchat-empty-state-view__icon' : 'cometchat-empty-state-view__icon-call' }), _jsxs("div", { className: "cometchat-empty-state-view__text", children: [_jsx("div", { className: "cometchat-empty-state-view__text-title", children: activeTab !== 'calls' ? getLocalizedString('chat_empty_title') : getLocalizedString('call_empty_title') }), activeTab !== 'calls'
                        ? getLocalizedString('chat_empty_subtitle')
                        : getLocalizedString('user_group_empty_state')] })] }));
};
