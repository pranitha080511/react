import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import chatIcon from '../../assets/start_chat.svg';
import createGroupIcon from '../../assets/create-group.svg';
import logoutIcon from '../../assets/logout.svg';
import userIcon from '../../assets/user.svg';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import '../../styles/CometChatSelector/CometChatSelector.css';
import { CometChatJoinGroup } from '../CometChatJoinGroup/CometChatJoinGroup';
import CometChatCreateGroup from '../CometChatCreateGroup/CometChatCreateGroup';
import { CometChatButton, CometChatCallLogs, CometChatConversations, CometChatGroups, CometChatOption, CometChatUIKit, CometChatUIKitLoginListener, CometChatUsers, getLocalizedString, CometChatContextMenu, Placement, } from '@cometchat/chat-uikit-react';
import { AppContext } from '../../context/AppContext';
import { useCometChatContext } from '../../context/CometChatContext';
import { CometChatSettings } from '../../CometChatSettings';
const CometChatSelector = (props) => {
    const { group, showJoinGroup, activeItem, activeTab, onSelectorItemClicked = () => { }, onProtectedGroupJoin = () => { }, showCreateGroup, setShowCreateGroup = () => { }, onHide = () => { }, onNewChatClicked = () => { }, onGroupCreated = () => { }, onSearchClicked = () => { }, hideCreateGroupButton = true, } = props;
    const [loggedInUser, setLoggedInUser] = useState();
    const { setAppState } = useContext(AppContext);
    const { chatFeatures, callFeatures } = useCometChatContext();
    const getLoggedInUser = CometChatUIKitLoginListener.getLoggedInUser();
    // Build usersRequestBuilder for users tab
    const usersRequestBuilder = React.useMemo(() => {
        let builder = new CometChat.UsersRequestBuilder().setLimit(30);
        if (chatFeatures?.userManagement?.friendsOnly) {
            builder = builder.friendsOnly(true);
        }
        return builder;
    }, [chatFeatures?.userManagement?.friendsOnly]);
    useEffect(() => {
        setLoggedInUser(getLoggedInUser);
    }, [getLoggedInUser]);
    useEffect(() => {
        if (activeTab === 'calls') {
            const iframe = document.getElementById('cometchat-frame');
            const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
            const voiceCallIcons = iframeDoc?.getElementsByClassName('cometchat-call-logs__list-item-trailing-view-audio') ||
                document.getElementsByClassName('cometchat-call-logs__list-item-trailing-view-audio');
            const videoCallIcons = iframeDoc?.getElementsByClassName('cometchat-call-logs__list-item-trailing-view-video') ||
                document.getElementsByClassName('cometchat-call-logs__list-item-trailing-view-video');
            const toggleCallIcons = () => {
                const voiceCallIcons = iframeDoc?.getElementsByClassName('cometchat-call-logs__list-item-trailing-view-audio') ||
                    document.getElementsByClassName('cometchat-call-logs__list-item-trailing-view-audio');
                const videoCallIcons = iframeDoc?.getElementsByClassName('cometchat-call-logs__list-item-trailing-view-video') ||
                    document.getElementsByClassName('cometchat-call-logs__list-item-trailing-view-video');
                if (callFeatures.voiceAndVideoCalling.oneOnOneVoiceCalling) {
                    Array.from(voiceCallIcons).forEach((icon) => {
                        icon.style.display = '';
                    });
                }
                else {
                    Array.from(voiceCallIcons).forEach((icon) => {
                        icon.style.display = 'none';
                    });
                }
                if (callFeatures.voiceAndVideoCalling.oneOnOneVideoCalling) {
                    Array.from(videoCallIcons).forEach((icon) => {
                        icon.style.display = '';
                    });
                }
                else {
                    Array.from(videoCallIcons).forEach((icon) => {
                        icon.style.display = 'none';
                    });
                }
            };
            if (voiceCallIcons.length === 0 && videoCallIcons.length === 0) {
                const interval = setInterval(() => {
                    if (voiceCallIcons.length > 0 || videoCallIcons.length > 0) {
                        clearInterval(interval);
                        toggleCallIcons();
                    }
                }, 1);
                return () => clearInterval(interval);
            }
            else {
                toggleCallIcons();
            }
        }
    }, [callFeatures, activeTab]);
    const getOptions = () => {
        return [
            new CometChatOption({
                id: 'logged-in-user',
                title: (loggedInUser && loggedInUser.getName()) || '',
                iconURL: userIcon,
            }),
            new CometChatOption({
                id: 'create-conversation',
                title: getLocalizedString('create_conversation'),
                iconURL: chatIcon,
                onClick: () => {
                    onNewChatClicked();
                },
            }),
            new CometChatOption({
                id: 'log-out',
                title: getLocalizedString('log_out'),
                iconURL: logoutIcon,
                onClick: () => {
                    logOut();
                },
            }),
        ];
    };
    const logOut = () => {
        CometChatUIKit.logout()
            .then(() => {
            setLoggedInUser(null);
            setAppState({ type: 'resetAppState' });
        })
            .catch((error) => {
            console.error('error', error);
        });
    };
    const conversationsHeaderView = () => {
        return (_jsxs("div", { className: "cometchat-conversations-header", children: [_jsx("div", { className: "cometchat-conversations-header__title", children: getLocalizedString('conversation_chat_title') }), _jsx("div", { className: "chat-menu", children: _jsx(CometChatContextMenu, { useParentContainer: true, closeOnOutsideClick: true, placement: Placement.bottom, data: getOptions(), topMenuSize: 1, onOptionClicked: (e) => {
                            const { onClick } = e;
                            if (onClick) {
                                onClick();
                            }
                        } }, "delete-button") })] }));
    };
    const groupsHeaderView = () => {
        return (_jsxs("div", { className: "cometchat-groups-header", children: [_jsx("div", { className: "cometchat-groups-header__title", children: getLocalizedString('group_title') }), !hideCreateGroupButton && (_jsx(CometChatButton, { onClick: () => {
                        setShowCreateGroup(true);
                    }, iconURL: createGroupIcon }))] }));
    };
    return (_jsx(_Fragment, { children: loggedInUser && (_jsxs(_Fragment, { children: [showJoinGroup && group && (_jsx(CometChatJoinGroup, { group: group, onHide: onHide, onProtectedGroupJoin: (group) => onProtectedGroupJoin(group) })), activeTab === 'chats' ? (_jsx(CometChatConversations, { showSearchBar: (chatFeatures && chatFeatures?.coreMessagingExperience?.conversationAndAdvancedSearch) ??
                        // CometChatSettings.chatFeatures.coreMessagingExperience.conversationAndAdvancedSearch
                        true, onSearchBarClicked: onSearchClicked, activeConversation: activeItem, headerView: conversationsHeaderView(), onItemClick: (e) => {
                        onSelectorItemClicked(e, 'updateSelectedItem');
                    }, hideUserStatus: (chatFeatures && !chatFeatures?.coreMessagingExperience?.userAndFriendsPresence) ??
                        !CometChatSettings.chatFeatures.coreMessagingExperience.userAndFriendsPresence, hideReceipts: (chatFeatures && !chatFeatures?.coreMessagingExperience?.messageDeliveryAndReadReceipts) ??
                        !CometChatSettings.chatFeatures.coreMessagingExperience.messageDeliveryAndReadReceipts })) : activeTab === 'calls' ? (_jsx(CometChatCallLogs, { activeCall: activeItem, onItemClick: (e) => {
                        onSelectorItemClicked(e, 'updateSelectedItemCall');
                    } })) : activeTab === 'users' ? (_jsx(CometChatUsers, { activeUser: activeItem, onItemClick: (e) => {
                        onSelectorItemClicked(e, 'updateSelectedItemUser');
                    }, usersRequestBuilder: usersRequestBuilder, hideUserStatus: (chatFeatures && !chatFeatures?.coreMessagingExperience?.userAndFriendsPresence) ??
                        !CometChatSettings.chatFeatures.coreMessagingExperience.userAndFriendsPresence })) : activeTab === 'groups' ? (_jsx(CometChatGroups, { activeGroup: activeItem, headerView: groupsHeaderView(), onItemClick: (e) => {
                        onSelectorItemClicked(e, 'updateSelectedItemGroup');
                    } })) : null, showCreateGroup && (_jsx(_Fragment, { children: _jsx(CometChatCreateGroup, { setShowCreateGroup: setShowCreateGroup, onGroupCreated: (group) => onGroupCreated(group) }) }))] })) }));
};
const MemoizedCometChatSelector = React.memo(CometChatSelector);
export { MemoizedCometChatSelector as CometChatSelector };
