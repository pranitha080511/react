import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import chatsIcon from '../../assets/chats.svg';
import callsIcon from '../../assets/calls.svg';
import usersIcon from '../../assets/users.svg';
import groupsIcon from '../../assets/groups.svg';
import '../../styles/CometChatSelector/CometChatTabs.css';
import { useState } from 'react';
import { getLocalizedString } from '@cometchat/chat-uikit-react';
import { useCometChatContext } from '../../context/CometChatContext';
export const CometChatTabs = (props) => {
    const { onTabClicked = () => { }, activeTab } = props;
    const [hoverTab, setHoverTab] = useState('');
    const { layoutFeatures } = useCometChatContext();
    const tabItems = [
        {
            name: getLocalizedString('conversation_chat_title'),
            icon: chatsIcon,
            id: 'chats',
        },
        {
            name: getLocalizedString('call_logs_title'),
            icon: callsIcon,
            id: 'calls',
        },
        {
            name: getLocalizedString('user_title'),
            icon: usersIcon,
            id: 'users',
        },
        {
            name: getLocalizedString('group_title'),
            icon: groupsIcon,
            id: 'groups',
        },
    ];
    const isTabActiveOrHovered = (name) => {
        return activeTab === name || hoverTab === name;
    };
    return (_jsx("div", { className: "cometchat-tab-component", style: layoutFeatures?.tabs?.length > 1 ? { display: 'flex' } : { display: 'none' }, children: tabItems
            .filter((tabItem) => layoutFeatures?.tabs?.includes(tabItem.id) // Keep only allowed tabs
        )
            .map((tabItem) => (_jsxs("div", { className: "cometchat-tab-component__tab", onClick: () => onTabClicked(tabItem), children: [_jsx("div", { className: `cometchat-tab-component__tab-icon cometchat-tab-component__tab-icon-${tabItem.id} ${isTabActiveOrHovered(tabItem.id) ? 'cometchat-tab-component__tab-icon-active' : ''}`, style: tabItem.icon ? { WebkitMask: `url(${tabItem.icon}), center, center, no-repeat` } : undefined, onMouseEnter: () => setHoverTab(tabItem.id), onMouseLeave: () => setHoverTab('') }), _jsx("div", { className: activeTab === tabItem.id || hoverTab === tabItem.id
                        ? 'cometchat-tab-component__tab-text cometchat-tab-component__tab-text-active'
                        : 'cometchat-tab-component__tab-text', onMouseEnter: () => setHoverTab(tabItem.id), onMouseLeave: () => setHoverTab(''), children: tabItem.name })] }, tabItem.id))) }));
};
