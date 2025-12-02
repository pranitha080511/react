import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import blockIcon from '../../assets/block.svg';
import deleteIcon from '../../assets/delete.svg';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { CometChatJoinGroup } from '../CometChatJoinGroup/CometChatJoinGroup';
import backbutton from '../../assets/arrow_back.svg';
import addMembersIcon from '../../assets/addMembers.svg';
import leaveGroupIcon from '../../assets/leaveGroup.svg';
import '../../styles/CometChatSelector/CometChatTabs.css';
import '../../styles/CometChatSelector/CometChatSelector.css';
import '../../styles/CometChatNewChat/CometChatNewChatView.css';
import '../../styles/CometChatMessages/CometChatMessages.css';
import '../../styles/CometChatDetails/CometChatDetails.css';
import '../../styles/CometChatApp.css';
import { CometChatEmptyStateView } from '../CometChatMessages/CometChatEmptyStateView';
import { AppContext } from '../../context/AppContext';
import { CometChatBannedMembers } from '../CometChatBannedMembers/CometChatBannedMembers';
import { CometChatAddMembers } from '../CometChatAddMembers/CometChatAddMembers';
import { CometChatTransferOwnership } from '../CometChatTransferOwnership/CometChatTransferOwnership';
import { CometChatMessages } from '../CometChatMessages/CometChatMessages';
import { CometChatTabs } from '../CometChatSelector/CometChatTabs';
import { CometChatSelector } from '../CometChatSelector/CometChatSelector';
import { CometChatUserDetails } from '../CometChatDetails/CometChatUserDetails';
import { CometChatThreadedMessages } from '../CometChatDetails/CometChatThreadedMessages';
import { CometChatCallDetails } from '../CometChatCallLog/CometChatCallLogDetails';
import { CometChatAlertPopup } from '../CometChatAlertPopup/CometChatAlertPopup';
import { CometChatAvatar, CometChatButton, CometChatConfirmDialog, CometChatConversationEvents, CometChatGroupEvents, CometChatGroupMembers, CometChatGroups, CometChatIncomingCall, CometChatMessageEvents, CometChatToast, CometChatUIKit, CometChatUIKitConstants, CometChatUIKitLoginListener, CometChatUIKitUtility, CometChatUserEvents, CometChatUsers, getLocalizedString, CometChatUIEvents, CometChatSearch, MessageStatus, CometChatAIAssistantChat, } from '@cometchat/chat-uikit-react';
import { CallLog, CometChatCalls } from '@cometchat/calls-sdk-javascript';
import { useCometChatContext } from '../../context/CometChatContext';
import { CometChatSettings } from '../../CometChatSettings';
import useSystemColorScheme from '../../customHooks';
import CometChatSearchView from '../CometChatSearchView/CometChatSearchView';
const MOBILE_BREAKPOINT = 768;
function CometChatHome({ defaultUser, defaultGroup, showGroupActionMessages }) {
    const { chatFeatures, styleFeatures, layoutFeatures } = useCometChatContext();
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [group, setGroup] = useState();
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [activeTab, setActiveTab] = useState(layoutFeatures.tabs[0]);
    const [selectedItem, setSelectedItem] = useState();
    const [showNewChat, setShowNewChat] = useState(false);
    const showJoinGroupRef = useRef(false);
    const [newChat, setNewChat] = useState();
    const [showAlertPopup, setShowAlertPopup] = useState({ visible: false, description: '' });
    const [showToast, setShowToast] = useState(false);
    const toastTextRef = useRef('');
    const isFreshChatRef = useRef(false);
    const currentChatRef = useRef(null);
    const { appState, setAppState } = useContext(AppContext);
    const freshChatRef = useRef({
        conversation: undefined,
        isNewChat: false,
    });
    const conversationItemClicked = useRef(false);
    const activeSideComponentRef = useRef('');
    const colorScheme = useSystemColorScheme();
    function isMobileView() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }
    useEffect(() => {
        if (appState.sideComponent.type) {
            activeSideComponentRef.current = appState.sideComponent.type;
        }
        else {
            activeSideComponentRef.current = '';
        }
    }, [appState.sideComponent]);
    useEffect(() => {
        const chatChanged = CometChatUIEvents.ccActiveChatChanged.subscribe((activeChat) => {
            if (activeChat && !activeChat.message) {
                setAppState({ type: 'updateIsFreshChat', payload: true });
                isFreshChatRef.current = true;
            }
            else {
                setAppState({ type: 'updateIsFreshChat', payload: false });
                isFreshChatRef.current = false;
            }
        });
        return () => chatChanged.unsubscribe();
    }, []);
    useEffect(() => {
        const listenerID = `HomeLoginListener_${new Date().getTime()}`;
        CometChat.addLoginListener(listenerID, new CometChat.LoginListener({
            logoutSuccess: () => {
                setSelectedItem(undefined);
                setNewChat(undefined);
                setAppState({ type: 'updateSelectedItem', payload: undefined });
                setAppState({ type: 'updateSelectedItemUser', payload: undefined });
                setAppState({ type: 'updateSelectedItemGroup', payload: undefined });
                setAppState({ type: 'newChat', payload: undefined });
            },
        }));
        return () => CometChat.removeConnectionListener(listenerID);
    });
    useEffect(() => {
        const ccOwnershipChanged = CometChatGroupEvents.ccOwnershipChanged.subscribe(() => {
            toastTextRef.current = getLocalizedString('ownership_transferred_successfully');
            setShowToast(true);
        });
        const ccGroupMemberScopeChanged = CometChatGroupEvents.ccGroupMemberScopeChanged.subscribe(() => {
            toastTextRef.current = getLocalizedString('permissions_updated_successfully');
            setShowToast(true);
        });
        const ccGroupMemberAdded = CometChatGroupEvents.ccGroupMemberAdded.subscribe(() => {
            toastTextRef.current = getLocalizedString('member_added');
            setShowToast(true);
        });
        const ccGroupMemberBanned = CometChatGroupEvents.ccGroupMemberBanned.subscribe(() => {
            toastTextRef.current = getLocalizedString('member_banned');
            setShowToast(true);
        });
        const ccGroupMemberKicked = CometChatGroupEvents.ccGroupMemberKicked.subscribe(() => {
            toastTextRef.current = getLocalizedString('member_removed');
            setShowToast(true);
        });
        return () => {
            ccOwnershipChanged?.unsubscribe();
            ccGroupMemberScopeChanged?.unsubscribe();
            ccGroupMemberAdded?.unsubscribe();
            ccGroupMemberBanned?.unsubscribe();
            ccGroupMemberKicked?.unsubscribe();
        };
    }, []);
    useEffect(() => {
        const user = CometChatUIKitLoginListener.getLoggedInUser();
        setLoggedInUser(user);
    }, []);
    useEffect(() => {
        const isMessageListOpen = selectedItem &&
            (selectedItem instanceof CometChat.User ||
                selectedItem instanceof CometChat.Group ||
                selectedItem instanceof CometChat.Conversation);
        if (activeTab === 'chats' || isMessageListOpen)
            return;
        const messageListenerId = `misc-message_${Date.now()}`;
        attachMessageReceivedListener(messageListenerId);
        return () => {
            CometChat.removeMessageListener(messageListenerId);
        };
    }, [activeTab, selectedItem]);
    /**
     * Handles new received messages
     */
    const onMessageReceived = useCallback(async (message) => {
        if (message.getSender().getUid() !== CometChatUIKitLoginListener.getLoggedInUser()?.getUid() &&
            !message.getDeliveredAt()) {
            try {
                CometChat.markAsDelivered(message);
            }
            catch (error) {
                console.error(error);
            }
        }
    }, []);
    const attachMessageReceivedListener = useCallback((messageListenerId) => {
        CometChat.addMessageListener(messageListenerId, new CometChat.MessageListener({
            onTextMessageReceived: (textMessage) => {
                onMessageReceived(textMessage);
            },
            onMediaMessageReceived: (mediaMessage) => {
                onMessageReceived(mediaMessage);
            },
            onCustomMessageReceived: (customMessage) => {
                onMessageReceived(customMessage);
            },
        }));
    }, [onMessageReceived]);
    const updateUserAfterBlockUnblock = (user) => {
        if (appState.selectedItemUser?.getUid() === user.getUid()) {
            setAppState({ type: 'updateSelectedItemUser', payload: user });
        }
        if (appState.selectedItem?.getConversationWith()?.getUid?.() === user.getUid()) {
            appState.selectedItem?.setConversationWith(user);
            setAppState({ type: 'updateSelectedItem', payload: appState.selectedItem });
        }
    };
    const TabComponent = () => {
        const onTabClicked = (tabItem) => {
            setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
            setAppState({ type: 'updateThreadSearchMessage', payload: undefined });
            setAppState({ type: 'updateThreadedMessage', payload: undefined });
            setAppState({ type: 'updateGoToMessageId', payload: undefined });
            setAppState({ type: 'updateShowMessagesSearch', payload: false });
            setNewChat(undefined);
            setActiveTab(tabItem.id);
        };
        return _jsx(CometChatTabs, { onTabClicked: onTabClicked, activeTab: activeTab });
    };
    const fetchDefaultUser = () => {
        if (defaultUser) {
            setSelectedItem(defaultUser);
            setAppState({ type: 'updateSelectedItemUser', payload: defaultUser });
        }
        else {
            const limit = 30, userRequest = new CometChat.UsersRequestBuilder().setLimit(limit).build();
            userRequest.fetchNext().then((userList) => {
                setSelectedItem(userList[0]);
                setAppState({ type: 'updateSelectedItemUser', payload: userList[0] });
            }, (error) => {
                console.error('Users list fetching failed with error:', error);
            });
        }
    };
    const fetchDefaultGroup = () => {
        if (defaultGroup) {
            setSelectedItem(defaultGroup);
            setAppState({ type: 'updateSelectedItemGroup', payload: defaultGroup });
        }
        else {
            const limit = 30, groupRequest = new CometChat.GroupsRequestBuilder().setLimit(limit).build();
            groupRequest.fetchNext().then((groupList) => {
                setSelectedItem(groupList[0]);
                setAppState({ type: 'updateSelectedItemGroup', payload: groupList[0] });
            }, (error) => {
                console.error('Group list fetching failed with error:', error);
            });
        }
    };
    const fetchDefaultCallDetail = () => {
        const callLog = new CometChatCalls.CallLogRequestBuilder()
            .setLimit(30)
            .setAuthToken(loggedInUser?.getAuthToken())
            .setCallCategory('call')
            .build();
        callLog.fetchNext().then((callList) => {
            setSelectedItem(callList[0]);
        }, (error) => {
            console.error('Call list fetching failed with error:', error);
        });
    };
    const fetchDefaultConversation = () => {
        let conversationType = 'user';
        if (layoutFeatures && layoutFeatures?.chatType === 'group') {
            conversationType = 'group';
        }
        if (defaultUser && conversationType === 'user') {
            CometChat.getConversation(defaultUser.getUid(), conversationType).then((conversation) => {
                setSelectedItem(conversation);
                setAppState({ type: 'updateSelectedItem', payload: conversation });
            }, (error) => {
                console.log('error while fetching a conversation', error);
                fetchDefaultUser();
            });
        }
        else if (defaultGroup && conversationType === 'group') {
            CometChat.getConversation(defaultGroup.getGuid(), conversationType).then((conversation) => {
                setSelectedItem(conversation);
                setAppState({ type: 'updateSelectedItem', payload: conversation });
            }, (error) => {
                console.log('error while fetching a conversation', error);
                fetchDefaultGroup();
            });
        }
        else if (activeTab === 'chats') {
            const limit = 30, conversationsRequest = new CometChat.ConversationsRequestBuilder()
                .setLimit(limit)
                .setConversationType(layoutFeatures.withSideBar ? '' : conversationType)
                .build();
            conversationsRequest.fetchNext().then((conversationList) => {
                setSelectedItem(conversationList?.[0]);
            }, (error) => {
                console.error('Conversations list fetching failed with error:', error);
                fetchDefaultGroup();
            });
        }
    };
    useEffect(() => {
        if (layoutFeatures && layoutFeatures?.tabs && layoutFeatures?.withSideBar) {
            if (layoutFeatures?.tabs?.includes('chats')) {
                fetchDefaultConversation();
                setActiveTab('chats');
            }
            else if (layoutFeatures?.tabs?.includes('calls')) {
                if (loggedInUser) {
                    fetchDefaultCallDetail();
                }
                setActiveTab('calls');
            }
            else if (layoutFeatures?.tabs?.includes('users')) {
                setActiveTab('users');
                fetchDefaultUser();
            }
            else {
                setActiveTab('groups');
                fetchDefaultGroup();
            }
        }
        if (!layoutFeatures?.withSideBar) {
            fetchDefaultConversation();
            setActiveTab('chats');
        }
    }, [layoutFeatures?.tabs, layoutFeatures?.withSideBar, loggedInUser]);
    useEffect(() => {
        if (activeTab === 'chats' && appState.selectedItem) {
            setSelectedItem(appState.selectedItem);
        }
        else if (activeTab === 'users' && appState.selectedItemUser) {
            setSelectedItem(appState.selectedItemUser);
        }
        else if (activeTab === 'groups' && appState.selectedItemGroup) {
            setSelectedItem(appState.selectedItemGroup);
        }
        else if (activeTab === 'calls' && appState.selectedItemCall) {
            setSelectedItem(appState.selectedItemCall);
        }
        else {
            setSelectedItem(undefined);
        }
    }, [activeTab]);
    const InformationComponent = useCallback(() => {
        return (_jsx(_Fragment, { children: showNewChat ? (_jsx(CometChatNewChatView, {})) : selectedItem || newChat?.user || newChat?.group ? (_jsx(CometChatMessagesViewComponent, {})) : (_jsx(CometChatEmptyStateView, { activeTab: activeTab })) }));
    }, [activeTab, showNewChat, selectedItem, newChat, appState.goToMessageId]);
    const CometChatMessagesViewComponent = () => {
        const [showComposer, setShowComposer] = useState(true);
        const [messageUser, setMessageUser] = useState();
        const [messageGroup, setMessageGroup] = useState();
        const [threadedMessage, setThreadedMsg] = useState();
        const { layoutFeatures } = useCometChatContext();
        const [isMobile, setIsMobile] = useState(getIframeWidth() < 768);
        // Mobile detection using iframe width if available
        function getIframeWidth() {
            const iframe = document.getElementById('cometchat-frame');
            if (iframe && iframe.contentWindow) {
                return iframe.contentWindow.innerWidth;
            }
            return window.innerWidth;
        }
        useEffect(() => {
            const handleResize = () => {
                setIsMobile(getIframeWidth() < 768);
            };
            window.addEventListener('resize', handleResize);
            const iframe = document.getElementById('cometchat-frame');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.addEventListener('resize', handleResize);
            }
            return () => {
                window.removeEventListener('resize', handleResize);
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.removeEventListener('resize', handleResize);
                }
            };
        }, []);
        useEffect(() => {
            if (newChat?.user) {
                setMessageUser(newChat.user);
                setMessageGroup(undefined);
            }
            else if (newChat?.group) {
                setMessageUser(undefined);
                setMessageGroup(newChat.group);
            }
            else {
                if (activeTab === 'chats') {
                    if (selectedItem?.getConversationType?.() ===
                        CometChatUIKitConstants.MessageReceiverType.user) {
                        setMessageUser(selectedItem?.getConversationWith());
                        setMessageGroup(undefined);
                    }
                    else if (selectedItem?.getConversationType?.() ===
                        CometChatUIKitConstants.MessageReceiverType.group) {
                        setMessageUser(undefined);
                        setMessageGroup(selectedItem?.getConversationWith());
                    }
                }
                else if (activeTab === 'users') {
                    setMessageUser(selectedItem);
                    setMessageGroup(undefined);
                }
                else if (activeTab === 'groups') {
                    setMessageUser(undefined);
                    setMessageGroup(selectedItem);
                }
                else {
                    setMessageUser(undefined);
                    setMessageGroup(undefined);
                }
            }
        }, [activeTab, selectedItem]);
        const updateisFirstChat = ({ message, status }) => {
            const receiverId = message?.getReceiverId();
            const sender = message?.getSender();
            if (((appState.selectedItemUser &&
                (appState.selectedItemUser.getUid() == receiverId ||
                    ((!sender || (sender && appState.selectedItemUser.getUid() == sender.getUid())) &&
                        receiverId == loggedInUser?.getUid()))) ||
                (appState.selectedItemGroup &&
                    (appState.selectedItemGroup.getGuid() == receiverId || loggedInUser?.getUid() == receiverId))) &&
                isFreshChatRef.current &&
                status == MessageStatus.success) {
                setAppState({ type: 'updateIsFreshChat', payload: false });
                isFreshChatRef.current = false;
                const conversationWith = appState.selectedItemUser
                    ? appState.selectedItemUser.getUid()
                    : appState.selectedItemGroup?.getGuid();
                const conversationType = appState.selectedItemUser
                    ? CometChatUIKitConstants.MessageReceiverType.user
                    : CometChatUIKitConstants.MessageReceiverType.group;
                if (!conversationWith)
                    return;
                CometChat.getConversation(conversationWith, conversationType).then((conversation) => {
                    setAppState({ type: 'updateSelectedItem', payload: conversation });
                    currentChatRef.current = conversation;
                });
            }
        };
        const subscribeToEvents = () => {
            const ccUserBlocked = CometChatUserEvents.ccUserBlocked.subscribe((user) => {
                if (user.getBlockedByMe()) {
                    setShowComposer(false);
                }
                updateUserAfterBlockUnblock(user);
            });
            const ccUserUnblocked = CometChatUserEvents.ccUserUnblocked.subscribe((user) => {
                if (!user.getBlockedByMe()) {
                    setShowComposer(true);
                }
                updateUserAfterBlockUnblock(user);
            });
            const ccMessageDeleted = CometChatMessageEvents.ccMessageDeleted.subscribe((message) => {
                if (message.getId() === threadedMessage?.getId()) {
                    setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                }
            });
            const ccMessageSent = CometChatMessageEvents.ccMessageSent.subscribe((data) => {
                updateisFirstChat(data);
            });
            const onTextMessageReceived = CometChatMessageEvents.onTextMessageReceived.subscribe((textMessage) => {
                updateisFirstChat({ message: textMessage, status: MessageStatus.success });
            });
            const onMediaMessageReceived = CometChatMessageEvents.onMediaMessageReceived.subscribe((mediaMessage) => {
                updateisFirstChat({ message: mediaMessage, status: MessageStatus.success });
            });
            const onCustomMessageReceived = CometChatMessageEvents.onCustomMessageReceived.subscribe((customMessage) => {
                updateisFirstChat({ message: customMessage, status: MessageStatus.success });
            });
            return () => {
                ccUserBlocked?.unsubscribe();
                ccUserUnblocked?.unsubscribe();
                ccMessageDeleted?.unsubscribe();
                ccMessageSent?.unsubscribe();
                onTextMessageReceived?.unsubscribe();
                onMediaMessageReceived?.unsubscribe();
                onCustomMessageReceived?.unsubscribe();
            };
        };
        useEffect(() => {
            if (messageUser?.getBlockedByMe?.()) {
                setShowComposer(false);
            }
            const unsubscribeFromEvents = subscribeToEvents();
            return () => {
                unsubscribeFromEvents();
            };
        }, [subscribeToEvents, selectedItem]);
        const showSideComponent = () => {
            let type = '';
            if (activeTab === 'chats') {
                if (selectedItem?.getConversationType?.() === 'group') {
                    type = 'group';
                }
                else {
                    type = 'user';
                }
            }
            else if (activeTab === 'users') {
                type = 'user';
            }
            else if (activeTab === 'groups') {
                type = 'group';
            }
            if (newChat?.user) {
                type = 'user';
            }
            else if (newChat?.group) {
                type = 'group';
            }
            if (activeSideComponentRef.current !== type) {
                activeSideComponentRef.current = type;
                setAppState({ type: 'updateSideComponent', payload: { visible: true, type } });
            }
        };
        const updateThreadedMessage = (message) => {
            setThreadedMsg(message);
            setAppState({ type: 'updateSideComponent', payload: { visible: true, type: 'threadedMessage' } });
            setAppState({ type: 'updateThreadedMessage', payload: message });
        };
        const onBack = () => {
            setSelectedItem(undefined);
            setNewChat(undefined);
            setAppState({ type: 'updateSelectedItem', payload: undefined });
            setAppState({ type: 'updateSelectedItemUser', payload: undefined });
            setAppState({ type: 'updateSelectedItemGroup', payload: undefined });
            setAppState({ type: 'newChat', payload: undefined });
        };
        const onSearchClicked = () => {
            setAppState({ type: 'updateShowMessagesSearch', payload: true });
            setAppState({ type: 'updateSideComponent', payload: { visible: true, type: 'search' } });
            activeSideComponentRef.current = '';
        };
        let messageComponent = (_jsx(CometChatMessages, { user: messageUser, group: messageGroup, onBack: onBack, onHeaderClicked: showSideComponent, onThreadRepliesClick: (message) => updateThreadedMessage(message), showComposer: showComposer, onSearchClicked: onSearchClicked, goToMessageId: appState.threadSearchMessage ? undefined : appState.goToMessageId, searchKeyword: appState.goToMessageId ? appState.searchKeyword : undefined, showGroupActionMessages: showGroupActionMessages }));
        if (!conversationItemClicked.current &&
            ((layoutFeatures.chatType === 'user' && defaultUser && activeTab !== 'groups') ||
                (layoutFeatures.chatType === 'group' && defaultGroup && activeTab !== 'users'))) {
            messageComponent = (_jsx(CometChatMessages, { user: layoutFeatures.chatType === 'user' ? defaultUser : undefined, group: layoutFeatures.chatType === 'group' ? defaultGroup : undefined, onBack: onBack, onHeaderClicked: showSideComponent, onThreadRepliesClick: (message) => updateThreadedMessage(message), showComposer: showComposer, onSearchClicked: onSearchClicked, goToMessageId: appState.threadSearchMessage ? undefined : appState.goToMessageId, searchKeyword: appState.goToMessageId ? appState.searchKeyword : undefined, showGroupActionMessages: showGroupActionMessages }));
        }
        if (messageUser && messageUser.getRole() == '@agentic') {
            messageComponent = (_jsx(CometChatAIAssistantChat, { user: messageUser, onBackButtonClicked: onBack, showBackButton: isMobile }));
        }
        return (_jsx(_Fragment, { children: selectedItem?.mode === 'call' ? (_jsx(CometChatCallDetails, { selectedItem: selectedItem, onBack: () => {
                    setSelectedItem(undefined);
                    setAppState({ type: 'updateSelectedItemCall', payload: undefined });
                } })) : (messageComponent) }));
    };
    const CometChatNewChatView = () => {
        const [selectedTab, setSelectedTab] = useState('user');
        const [group, setGroup] = useState();
        const loggedInUser = CometChatUIKitLoginListener.getLoggedInUser();
        const { chatFeatures } = useCometChatContext();
        const handleTabClick = (tab) => {
            setSelectedTab(tab);
        };
        const joinGroup = (e) => {
            if (!e.getHasJoined()) {
                if (e.getType() === CometChatUIKitConstants.GroupTypes.public) {
                    CometChat.joinGroup(e.getGuid(), e.getType())
                        .then((response) => {
                        setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                        response.setHasJoined?.(true);
                        response.setScope?.(CometChatUIKitConstants.groupMemberScope.participant);
                        setNewChat({ group: response, user: undefined });
                        setShowNewChat(false);
                        setTimeout(() => {
                            CometChatGroupEvents.ccGroupMemberJoined.next({
                                joinedGroup: response,
                                joinedUser: loggedInUser,
                            });
                        }, 100);
                    })
                        .catch((error) => {
                        console.error(error);
                    });
                }
                else {
                    setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                    setGroup(e);
                    showJoinGroupRef.current = true;
                }
            }
            else {
                setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                setNewChat({ group: e, user: undefined });
                setShowNewChat(false);
            }
        };
        const TabContent = ({ selectedTab }) => {
            let usersRequestBuilder = new CometChat.UsersRequestBuilder().setLimit(30);
            if (chatFeatures?.userManagement?.friendsOnly) {
                usersRequestBuilder = usersRequestBuilder.friendsOnly(true);
            }
            return selectedTab === 'user' ? (_jsx(CometChatUsers, { usersRequestBuilder: usersRequestBuilder, onItemClick: (user) => {
                    setNewChat({ user, group: undefined });
                    setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                    setShowNewChat(false);
                    setAppState({ type: 'updateSelectedItemUser', payload: user });
                    setAppState({ type: 'updateSelectedItemGroup', payload: undefined });
                }, hideUserStatus: (chatFeatures && !chatFeatures?.coreMessagingExperience?.userAndFriendsPresence) ??
                    !CometChatSettings.chatFeatures.coreMessagingExperience.userAndFriendsPresence })) : (_jsx(CometChatGroups, { groupsRequestBuilder: new CometChat.GroupsRequestBuilder().joinedOnly(true).setLimit(30), onItemClick: (e) => {
                    setAppState({ type: 'updateSelectedItemUser', payload: undefined });
                    setAppState({ type: 'updateSelectedItemGroup', payload: e });
                    joinGroup(e);
                } }));
        };
        return (_jsxs("div", { className: "cometchat-new-chat-view", children: [showJoinGroupRef.current && group && (_jsx(CometChatJoinGroup, { group: group, onHide: () => (showJoinGroupRef.current = false), onProtectedGroupJoin: (group) => {
                        if (activeTab === 'chats') {
                            setShowNewChat(false);
                            const convId = group?.getGuid();
                            const convType = CometChatUIKitConstants.MessageReceiverType.group;
                            CometChat.getConversation(convId, convType).then((conversation) => {
                                setSelectedItem(conversation);
                            }, (error) => {
                                setSelectedItem(undefined);
                                console.error('error while fetching a conversation', error);
                            });
                        }
                        else {
                            setSelectedItem(group);
                        }
                    } })), _jsxs("div", { className: "cometchat-new-chat-view__header", children: [_jsx(CometChatButton, { iconURL: backbutton, onClick: () => {
                                setShowNewChat(false);
                            } }), _jsx("div", { className: "cometchat-new-chat-view__header-title", children: getLocalizedString('new_chat_title') })] }), _jsxs("div", { className: "cometchat-new-chat-view__tabs", children: [_jsxs("div", { className: `cometchat-new-chat-view__tabs-tab ${selectedTab === 'user' ? 'cometchat-new-chat-view__tabs-tab-active' : ''}`, onClick: () => handleTabClick('user'), children: [' ', getLocalizedString('user_title')] }), _jsxs("div", { className: `cometchat-new-chat-view__tabs-tab ${selectedTab === 'group' ? 'cometchat-new-chat-view__tabs-tab-active' : ''}`, onClick: () => handleTabClick('group'), children: [' ', getLocalizedString('group_title')] })] }), _jsx("div", { style: { overflow: 'hidden' }, children: _jsx(TabContent, { selectedTab: selectedTab }) })] }));
    };
    const SideComponent = React.memo(() => {
        const [group, setGroup] = useState();
        const [user, setUser] = useState();
        useEffect(() => {
            if (activeTab === 'chats') {
                if (selectedItem?.getConversationType?.() === 'user') {
                    setUser(selectedItem?.getConversationWith());
                }
                else if (selectedItem?.getConversationType?.() === 'group') {
                    setGroup(selectedItem.getConversationWith());
                }
                else if (defaultUser && defaultUser instanceof CometChat.User) {
                    setUser(defaultUser);
                }
                else if (defaultGroup && defaultGroup instanceof CometChat.Group) {
                    setGroup(defaultGroup);
                }
            }
            else if (activeTab === 'users') {
                setUser(selectedItem);
            }
            else if (activeTab === 'groups') {
                setGroup(selectedItem);
            }
        }, [selectedItem, activeTab]);
        useEffect(() => {
            if (newChat?.user) {
                setUser(newChat.user);
            }
            else if (newChat?.group) {
                setGroup(newChat.group);
            }
        }, [newChat]);
        const updateGroupDetails = (eventGroup) => {
            if (eventGroup.getGuid() === group?.getGuid()) {
                group.setMembersCount(eventGroup.getMembersCount());
                group.setScope(eventGroup.getScope());
                group.setOwner(eventGroup.getOwner());
                setGroup(group);
            }
        };
        const attachSDKGroupListenerForDetails = () => {
            const listenerId = 'GroupDetailsListener_' + String(Date.now());
            CometChat.addGroupListener(listenerId, new CometChat.GroupListener({
                onGroupMemberBanned: (message, bannedUser, bannedBy, bannedFrom) => {
                    updateGroupDetails(bannedFrom);
                },
                onGroupMemberKicked: (message, kickedUser, kickedBy, kickedFrom) => {
                    updateGroupDetails(kickedFrom);
                },
                onMemberAddedToGroup: (message, userAdded, userAddedBy, userAddedIn) => {
                    updateGroupDetails(userAddedIn);
                },
                onGroupMemberJoined: (message, joinedUser, joinedGroup) => {
                    updateGroupDetails(joinedGroup);
                },
                onGroupMemberLeft: (message, leavingUser, group) => {
                    updateGroupDetails(group);
                },
            }));
            return () => CometChat.removeGroupListener(listenerId);
        };
        useEffect(() => {
            if (loggedInUser) {
                const unsubscribeFromGroupEvents = attachSDKGroupListenerForDetails();
                return () => {
                    unsubscribeFromGroupEvents();
                };
            }
        }, [loggedInUser, attachSDKGroupListenerForDetails]);
        const onBack = () => {
            setAppState({ type: 'updateShowMessagesSearch', payload: false });
            setAppState({ type: 'updateSideComponentTop', payload: null });
            setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
            activeSideComponentRef.current = appState.sideComponent.type;
        };
        const onSearchMessageClicked = async (message, searchKeyword) => {
            const iframe = document.getElementById('cometchat-frame');
            const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
            const el = document.querySelector('.side-component-wrapper') || iframeDoc?.querySelector('.side-component-wrapper');
            const computedZIndex = window.getComputedStyle(el).zIndex;
            if (searchKeyword) {
                setAppState({ type: 'UpdateSearchKeyword', payload: searchKeyword });
            }
            if (message.getParentMessageId()) {
                const msg = await CometChat.getMessageDetails(message.getParentMessageId());
                if (msg) {
                    setAppState({ type: 'updateSideComponent', payload: { visible: true, type: 'threadedMessage' } });
                    setAppState({ type: 'updateThreadSearchMessage', payload: message });
                    setAppState({ type: 'updateThreadedMessage', payload: msg });
                    setAppState({ type: 'updateGoToMessageId', payload: String(message.getId()) });
                }
            }
            else {
                setAppState({ type: 'updateThreadSearchMessage', payload: undefined });
                setAppState({ type: 'updateGoToMessageId', payload: String(message.getId()) });
            }
            if (isMobileView()) {
                onBack();
            }
            if (computedZIndex !== 'auto') {
                onBack();
            }
        };
        return (_jsx(_Fragment, { children: appState.sideComponent.visible ? (_jsx("div", { className: `side-component-wrapper ${appState.threadSearchMessage ? 'side-component-wrapper--threaded' : ''}`, children: _jsxs("div", { className: "side-component-wrapper__content", children: [appState.sideComponent.type == 'user' && user && (_jsx("div", { style: appState.sideComponentTop === 'user' ? { display: 'block' } : { display: 'none' }, className: `side-component-wrapper__content-view ${appState.sideComponentTop === 'user' ? 'side-component-wrapper__content-top' : 'side-component-wrapper__content-bottom'}`, children: _jsx(SideComponentUser, { user: user }) })), appState.sideComponent.type == 'group' && group && (_jsx("div", { style: appState.sideComponentTop === 'group' ? { display: 'block' } : { display: 'none' }, className: `side-component-wrapper__content-view ${appState.sideComponentTop === 'group' ? 'side-component-wrapper__content-top' : 'side-component-wrapper__content-bottom'}`, children: _jsx(SideComponentGroup, { group: group }) })), appState.sideComponent.type == 'threadedMessage' && appState.threadedMessage ? (_jsx("div", { style: appState.sideComponentTop === 'threadedMessage' ? { display: 'block' } : { display: 'none' }, className: `side-component-wrapper__content-view ${appState.sideComponentTop === 'threadedMessage' ? 'side-component-wrapper__content-top' : 'side-component-wrapper__content-bottom'}`, children: _jsx(SideComponentThread, { message: appState.threadedMessage }) })) : null, appState.sideComponent.type == 'search' && appState.showMessagesSearch ? (_jsx("div", { style: appState.sideComponentTop === 'search' ? { display: 'block' } : { display: 'none' }, className: `side-component-wrapper__content-view ${appState.sideComponentTop === 'search' ? 'side-component-wrapper__content-top' : 'side-component-wrapper__content-bottom'}`, children: _jsx(CometChatSearchView, { user: user, group: group, onClose: onBack, onMessageClicked: onSearchMessageClicked }) })) : null] }) })) : null }));
    });
    SideComponent.displayName = 'SideComponent';
    const SideComponentUser = (props) => {
        const { user } = props;
        const actionItemsArray = [
            {
                id: 'block-unblock',
                name: user.getBlockedByMe?.()
                    ? getLocalizedString('user_details_unblock')
                    : getLocalizedString('user_details_block'),
                icon: blockIcon,
            },
            {
                id: 'delete',
                name: getLocalizedString('delete_chat'),
                icon: deleteIcon,
            },
        ];
        const [actionItems, setActionItems] = useState(actionItemsArray);
        const [showStatus, setShowStatus] = useState(true);
        const [showBlockUserDialog, setShowBlockUserDialog] = useState(false);
        const [showDeleteConversationDialog, setShowDeleteConversationDialog] = useState(false);
        const onBlockUserClicked = () => {
            const UID = user.getUid();
            return new Promise((resolve, reject) => {
                CometChat.blockUsers([UID]).then(() => {
                    user.setBlockedByMe(true);
                    CometChatUserEvents.ccUserBlocked.next(user);
                    toastTextRef.current = getLocalizedString('blocked_successfully');
                    setShowToast(true);
                    return resolve();
                }, () => {
                    return reject();
                });
            });
        };
        const onUnblockUserClicked = () => {
            const UID = user.getUid();
            CometChat.unblockUsers([UID]).then(() => {
                setActionItems([
                    {
                        id: 'block-unblock',
                        name: getLocalizedString('user_details_block'),
                        icon: blockIcon,
                    },
                    {
                        id: 'delete',
                        name: getLocalizedString('delete_chat'),
                        icon: deleteIcon,
                    },
                ]);
                user.setBlockedByMe(false);
                CometChatUserEvents.ccUserUnblocked.next(user);
            }, (error) => {
                console.log('Blocking user fails with error', error);
            });
        };
        const onDeleteConversationClicked = () => {
            const UID = user.getUid();
            return new Promise((resolve, reject) => {
                CometChat.deleteConversation(UID, 'user')
                    .then(() => {
                    setSelectedItem(undefined);
                    setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                    CometChatConversationEvents.ccConversationDeleted.next((selectedItem instanceof CometChat.Conversation
                        ? selectedItem
                        : freshChatRef.current.conversation));
                    toastTextRef.current = getLocalizedString('chat_deleted_successfully');
                    setShowToast(true);
                    return resolve();
                })
                    .then((error) => {
                    console.error('error while deleting a conversation', error);
                    return reject();
                });
            });
        };
        const onUserActionClick = (item) => {
            if (item.name === getLocalizedString('user_details_block')) {
                setShowBlockUserDialog(true);
            }
            else if (item.name === getLocalizedString('user_details_unblock')) {
                onUnblockUserClicked();
            }
            else if (item.name === getLocalizedString('delete_chat')) {
                setShowDeleteConversationDialog(true);
            }
        };
        const subscribeToEvents = () => {
            const ccUserBlocked = CometChatUserEvents.ccUserBlocked.subscribe((user) => {
                if (user.getBlockedByMe()) {
                    setShowStatus(false);
                    setActionItems([
                        {
                            id: 'block-unblock',
                            name: getLocalizedString('user_details_unblock'),
                            icon: blockIcon,
                        },
                        {
                            id: 'delete',
                            name: getLocalizedString('delete_chat'),
                            icon: deleteIcon,
                        },
                    ]);
                }
                updateUserAfterBlockUnblock(user);
            });
            const ccUserUnblocked = CometChatUserEvents.ccUserUnblocked.subscribe((user) => {
                if (!user.getBlockedByMe()) {
                    setShowStatus(true);
                    setActionItems([
                        {
                            id: 'block-unblock',
                            name: getLocalizedString('user_details_block'),
                            icon: blockIcon,
                        },
                        {
                            id: 'delete',
                            name: getLocalizedString('delete_chat'),
                            icon: deleteIcon,
                        },
                    ]);
                }
                updateUserAfterBlockUnblock(user);
            });
            return () => {
                ccUserBlocked?.unsubscribe();
                ccUserUnblocked?.unsubscribe();
            };
        };
        useEffect(() => {
            if (user.getHasBlockedMe()) {
                setShowStatus(false);
            }
            const unsubscribeFromEvents = subscribeToEvents();
            return () => {
                unsubscribeFromEvents();
            };
        }, [subscribeToEvents, selectedItem]);
        const onHide = () => setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
        const getDeleteConversationConfirmationView = () => {
            return (_jsx(_Fragment, { children: _jsx("div", { className: "cometchat-delete-chat-dialog__backdrop", children: _jsx(CometChatConfirmDialog, { title: getLocalizedString('delete_chat'), messageText: getLocalizedString('confirm_delete_chat'), confirmButtonText: getLocalizedString('conversation_delete_title'), onCancelClick: () => {
                            setShowDeleteConversationDialog(!showDeleteConversationDialog);
                        }, onSubmitClick: onDeleteConversationClicked }) }) }));
        };
        const getBlockUserConfirmationDialogView = () => {
            return (_jsx(_Fragment, { children: _jsx("div", { className: "cometchat-block-user-dialog__backdrop", children: _jsx(CometChatConfirmDialog, { title: getLocalizedString('block_contact'), messageText: getLocalizedString('confirm_block_contact'), confirmButtonText: getLocalizedString('user_details_block'), onCancelClick: () => {
                            setShowBlockUserDialog(!showBlockUserDialog);
                        }, onSubmitClick: onBlockUserClicked }) }) }));
        };
        return (_jsxs(_Fragment, { children: [showDeleteConversationDialog && getDeleteConversationConfirmationView(), showBlockUserDialog && getBlockUserConfirmationDialogView(), _jsx(CometChatUserDetails, { user: user, actionItems: actionItems, onHide: onHide, showStatus: showStatus, onUserActionClick: onUserActionClick })] }));
    };
    const SideComponentGroup = React.memo((props) => {
        const [groupTab, setGroupTab] = useState('view');
        const [showAddMembers, setShowAddMembers] = useState(false);
        const [showLeaveGroup, setShowLeaveGroup] = useState(false);
        const [showTransferownershipDialog, setShowTransferownershipDialog] = useState(false);
        const [showDeleteGroup, setShowDeleteGroup] = useState(false);
        const [showTransferOwnership, setShowTransferOwnership] = useState(false);
        const [showDeleteGroupChatDialog, setShowDeleteGroupChatDialog] = useState(false);
        const [actionItems, setActionItems] = useState([]);
        const [scopeChanged, setScopeChanged] = useState(false);
        const { group } = props;
        const groupListenerRef = useRef('groupinfo_GroupListener_' + String(Date.now()));
        const [memberCount, setMemberCount] = useState(group.getMembersCount());
        const [groupOwner, setGroupOwner] = useState(group.getOwner());
        const { appState, setAppState } = useContext(AppContext);
        const { chatFeatures } = useCometChatContext();
        useEffect(() => {
            CometChat.addGroupListener(groupListenerRef.current, new CometChat.GroupListener({
                onGroupMemberScopeChanged: (message, changedUser, newScope, oldScope, changedGroup) => {
                    if (changedGroup.getGuid() !== group?.getGuid()) {
                        return;
                    }
                    if (changedUser.getUid() === loggedInUser?.getUid()) {
                        setGroup(changedGroup);
                        setGroupOwner(changedGroup.getOwner());
                        setScopeChanged(true);
                    }
                },
                onGroupMemberKicked: (message, kickedUser, kickedBy, kickedFrom) => {
                    setMemberCount(kickedFrom.getMembersCount());
                    setGroup(kickedFrom);
                    setGroupOwner(kickedFrom.getOwner());
                },
                onGroupMemberBanned: (message, bannedUser, bannedBy, bannedFrom) => {
                    setMemberCount(bannedFrom.getMembersCount());
                    setGroup(bannedFrom);
                    setGroupOwner(bannedFrom.getOwner());
                },
                onMemberAddedToGroup: (message, userAdded, userAddedBy, userAddedIn) => {
                    setMemberCount(userAddedIn.getMembersCount());
                    setGroup(userAddedIn);
                },
                onGroupMemberLeft: (message, leavingUser, group) => {
                    setMemberCount(group.getMembersCount());
                    setGroup(group);
                    setGroupOwner(group.getOwner());
                },
                onGroupMemberJoined: (message, joinedUser, joinedGroup) => {
                    setMemberCount(joinedGroup.getMembersCount());
                    setGroup(joinedGroup);
                },
            }));
            const ccGroupMemberAdded = CometChatGroupEvents.ccGroupMemberAdded.subscribe((item) => {
                setMemberCount(item.userAddedIn.getMembersCount());
                setGroup(item.userAddedIn);
            });
            const ccGroupMemberBanned = CometChatGroupEvents.ccGroupMemberBanned.subscribe((item) => {
                setMemberCount(item.kickedFrom.getMembersCount());
                setGroup(item.kickedFrom);
            });
            const ccGroupMemberKicked = CometChatGroupEvents.ccGroupMemberKicked.subscribe((item) => {
                setMemberCount(item.kickedFrom.getMembersCount());
                setGroup(item.kickedFrom);
            });
            return () => {
                ccGroupMemberAdded?.unsubscribe();
                ccGroupMemberBanned?.unsubscribe();
                ccGroupMemberKicked?.unsubscribe();
                CometChat.removeGroupListener(groupListenerRef.current);
            };
        }, [group]);
        useEffect(() => {
            const tempActionItems = [
                {
                    id: 'addMembersToGroups',
                    name: getLocalizedString('add_members'),
                    icon: addMembersIcon,
                    type: 'scope',
                    onClick: () => {
                        setShowAddMembers(!showAddMembers);
                    },
                    isAllowed: () => {
                        return isAdminOrOwner();
                    },
                },
                {
                    id: 'deleteChat',
                    name: getLocalizedString('delete_chat'),
                    icon: deleteIcon,
                    type: 'alert',
                    onClick: () => {
                        setShowDeleteGroupChatDialog(true);
                    },
                    isAllowed: () => {
                        return true;
                    },
                },
                {
                    id: 'joinLeaveGroup',
                    name: getLocalizedString('leave'),
                    icon: leaveGroupIcon,
                    type: 'alert',
                    onClick: () => {
                        if (group.getOwner() === CometChatUIKitLoginListener.getLoggedInUser()?.getUid()) {
                            setShowTransferownershipDialog(!showTransferownershipDialog);
                        }
                        else {
                            setShowLeaveGroup(!showLeaveGroup);
                        }
                    },
                    isAllowed: () => {
                        return (group.getMembersCount() > 1 ||
                            (group.getMembersCount() === 1 && loggedInUser?.getUid() !== group.getOwner()));
                    },
                },
                {
                    id: 'deleteGroup',
                    name: getLocalizedString('delete_and_exit'),
                    icon: deleteIcon,
                    type: 'alert',
                    onClick: () => {
                        setShowDeleteGroup(!showDeleteGroup);
                    },
                    isAllowed: () => {
                        return isAdminOrOwner();
                    },
                },
            ];
            // Filter action items based on groupManagement permissions
            const groupManagementPermissions = chatFeatures.groupManagement;
            const filteredActionItems = tempActionItems.filter((item) => {
                // Always include `deleteGroup` (delete chat)
                if (item.id === 'deleteChat') {
                    return true;
                }
                // Include based on groupManagement permissions
                return groupManagementPermissions[item.id];
            });
            // Set the filtered action items
            setActionItems(filteredActionItems);
        }, [scopeChanged, group, memberCount, chatFeatures?.groupManagement]);
        const isAdminOrOwner = () => {
            return (group.getScope() === CometChatUIKitConstants.groupMemberScope.admin ||
                group.getScope() === CometChatUIKitConstants.groupMemberScope.owner);
        };
        function transferOwnershipDialogView() {
            return (_jsx(_Fragment, { children: _jsx("div", { className: "cometchat-transfer-ownership-dialog__backdrop", children: _jsx(CometChatConfirmDialog, { title: getLocalizedString('ownership_transfer'), messageText: getLocalizedString('confirm_ownership_transfer'), confirmButtonText: getLocalizedString('continue'), onCancelClick: () => {
                            setShowTransferownershipDialog(!showTransferownershipDialog);
                        }, onSubmitClick: () => {
                            return new Promise((resolve) => {
                                setShowTransferownershipDialog(!showTransferownershipDialog);
                                setShowTransferOwnership(!showTransferOwnership);
                                return resolve();
                            });
                        } }) }) }));
        }
        function transferOwnershipView() {
            return (_jsx(_Fragment, { children: _jsx("div", { className: "cometchat-transfer-ownership__backdrop", children: _jsx(CometChatTransferOwnership, { group: group, onClose: () => {
                            setShowTransferOwnership(!showTransferOwnership);
                        } }) }) }));
        }
        function addMembersView() {
            return (_jsx(_Fragment, { children: _jsx("div", { className: "cometchat-add-members-wrapper", children: _jsx(CometChatAddMembers, { showBackButton: true, onBack: () => {
                            setShowAddMembers(!showAddMembers);
                        }, group: group }) }) }));
        }
        function deleteGroupView() {
            return (_jsx(_Fragment, { children: _jsx("div", { className: "cometchat-delete-group__backdrop", children: _jsx(CometChatConfirmDialog, { title: getLocalizedString('delete_and_exit'), messageText: getLocalizedString('confirm_delete_and_exit'), confirmButtonText: getLocalizedString('delete_and_exit_label'), onCancelClick: () => {
                            setShowDeleteGroup(!showDeleteGroup);
                        }, onSubmitClick: () => {
                            return new Promise((resolve, reject) => {
                                CometChat.deleteGroup(group.getGuid())
                                    .then(() => {
                                    setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                                    setSelectedItem(undefined);
                                    CometChatGroupEvents.ccGroupDeleted.next(CometChatUIKitUtility.clone(group));
                                    setShowDeleteGroup(!showDeleteGroup);
                                    CometChatConversationEvents.ccConversationDeleted.next(selectedItem);
                                    toastTextRef.current = getLocalizedString('group_left_and_chat_deleted');
                                    setShowToast(true);
                                    return resolve();
                                })
                                    .catch(() => {
                                    return reject();
                                });
                            });
                        } }) }) }));
        }
        const createGroupMemberLeftActionMessage = useCallback((group, loggedInUser) => {
            const action = CometChatUIKitConstants.groupMemberAction.LEFT;
            const actionMessage = new CometChat.Action(group.getGuid(), CometChatUIKitConstants.MessageTypes.groupMember, CometChatUIKitConstants.MessageReceiverType.group, CometChatUIKitConstants.MessageCategory.action);
            actionMessage.setAction(action);
            actionMessage.setActionBy(CometChatUIKitUtility.clone(loggedInUser));
            actionMessage.setActionFor(CometChatUIKitUtility.clone(group));
            actionMessage.setActionOn(CometChatUIKitUtility.clone(loggedInUser));
            actionMessage.setReceiver(CometChatUIKitUtility.clone(group));
            actionMessage.setSender(CometChatUIKitUtility.clone(loggedInUser));
            actionMessage.setConversationId('group_' + group.getGuid());
            actionMessage.setMuid(CometChatUIKitUtility.ID());
            actionMessage.setMessage(`${loggedInUser.getName()} ${action} ${loggedInUser.getUid()}`);
            actionMessage.setSentAt(CometChatUIKitUtility.getUnixTimestamp());
            return actionMessage;
        }, []);
        function leaveGroupView() {
            return (_jsx(_Fragment, { children: _jsx("div", { className: "cometchat-leave-group__backdrop", children: _jsx(CometChatConfirmDialog, { title: getLocalizedString('leave_group'), messageText: getLocalizedString('confirm_leave_group'), confirmButtonText: getLocalizedString('leave'), onCancelClick: () => {
                            setShowLeaveGroup(!showLeaveGroup);
                        }, onSubmitClick: () => {
                            return new Promise((resolve, reject) => {
                                CometChat.leaveGroup(group.getGuid())
                                    .then(() => {
                                    const loggedInUser = CometChatUIKitLoginListener.getLoggedInUser();
                                    if (loggedInUser) {
                                        const groupClone = CometChatUIKitUtility.clone(group);
                                        groupClone.setHasJoined(false);
                                        groupClone.setMembersCount(groupClone.getMembersCount() - 1);
                                        CometChatGroupEvents.ccGroupLeft.next({
                                            userLeft: CometChatUIKitUtility.clone(loggedInUser),
                                            leftGroup: groupClone,
                                            message: createGroupMemberLeftActionMessage(groupClone, loggedInUser),
                                        });
                                    }
                                    setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                                    setSelectedItem(undefined);
                                    setAppState({ type: 'updateSelectedItem', payload: undefined });
                                    setAppState({ type: 'updateSelectedItemGroup', payload: undefined });
                                    setShowLeaveGroup(!showLeaveGroup);
                                    toastTextRef.current = getLocalizedString('group_left');
                                    setShowToast(true);
                                    return resolve();
                                })
                                    .catch(() => {
                                    return reject();
                                });
                            });
                        } }) }) }));
        }
        const onDeleteGroupConversationClicked = () => {
            const GUID = group.getGuid();
            return new Promise(async (resolve, reject) => {
                CometChat.deleteConversation(GUID, CometChatUIKitConstants.MessageReceiverType.group).then(() => {
                    setSelectedItem(undefined);
                    setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                    CometChatConversationEvents.ccConversationDeleted.next(selectedItem);
                    return resolve();
                }, (error) => {
                    console.error('error while deleting a conversation', error);
                    return reject();
                });
            });
        };
        const getDeleteConversationConfirmationView = () => {
            return (_jsx(_Fragment, { children: _jsx("div", { className: "cometchat-delete-chat-dialog__backdrop", children: _jsx(CometChatConfirmDialog, { title: getLocalizedString('delete_chat'), messageText: getLocalizedString('confirm_delete_chat'), confirmButtonText: getLocalizedString('conversation_delete_title'), onCancelClick: () => {
                            setShowDeleteGroupChatDialog(!showDeleteGroupChatDialog);
                        }, onSubmitClick: onDeleteGroupConversationClicked }) }) }));
        };
        return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "side-component-header", children: [_jsx("div", { className: "side-component-header__text", children: getLocalizedString('group_info') }), _jsx("div", { className: "side-component-header__icon", onClick: () => setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } }) })] }), _jsxs("div", { className: "side-component-content", children: [_jsxs("div", { className: "side-component-content__group", children: [_jsx("div", { className: "side-component-content__avatar", children: _jsx(CometChatAvatar, { image: group?.getIcon(), name: group?.getName() }) }), _jsxs("div", { children: [_jsx("div", { className: "side-component-content__title", children: group?.getName() }), _jsx("div", { className: "side-component-content__description", children: group?.getMembersCount?.() + ' ' + getLocalizedString('group_members') })] })] }), _jsx("div", { className: "side-component-content__action", children: actionItems.map((actionItem, index) => actionItem.isAllowed() ? (_jsxs("div", { className: `side-component-content__action-item ${appState.isFreshChat && actionItem.id === 'deleteChat' ? 'side-component-content__action-item-disabled' : ''}`, onClick: () => {
                                    if (actionItem.onClick) {
                                        actionItem.onClick();
                                    }
                                }, children: [_jsx("div", { className: actionItem.type === 'alert'
                                            ? `side-component-content__action-item-icon side-component-content__action-item-icon-${actionItem.id}`
                                            : `side-component-content__action-item-icon-default side-component-content__action-item-icon-default-${actionItem.id}`, style: actionItem.icon ? { WebkitMask: `url(${actionItem.icon}), center, center, no-repeat` } : undefined }), _jsx("div", { className: actionItem.type === 'alert'
                                            ? 'side-component-content__action-item-text'
                                            : 'side-component-content__action-item-text-default', children: actionItem.name })] }, actionItem.name + index)) : null) }), chatFeatures && chatFeatures?.groupManagement.viewGroupMembers && (_jsxs(_Fragment, { children: [group.getScope() !== CometChatUIKitConstants.groupMemberScope.participant ? (_jsx("div", { className: "side-component-group-tabs-wrapper", children: _jsxs("div", { className: "side-component-group-tabs", children: [_jsx("div", { className: `side-component-group-tabs__tab ${groupTab === 'view' ? 'side-component-group-tabs__tab-active' : ''}`, onClick: () => setGroupTab('view'), children: _jsx("div", { className: `side-component-group-tabs__tab-text ${groupTab === 'view' ? 'side-component-group-tabs__tab-text-active' : ''}`, children: getLocalizedString('view_members') }) }), _jsx("div", { className: `side-component-group-tabs__tab ${groupTab === 'banned' ? 'side-component-group-tabs__tab-active' : ''}`, onClick: () => {
                                                    setGroupTab('banned');
                                                }, children: _jsx("div", { className: `side-component-group-tabs__tab-text ${groupTab === 'banned' ? 'side-component-group-tabs__tab-text-active' : ''}`, children: getLocalizedString('banned_members') }) })] }) })) : null, _jsx("div", { className: isAdminOrOwner() ? 'side-component-group-members-with-tabs' : 'side-component-group-members', children: groupTab === 'view' ? (_jsx(CometChatGroupMembers, { group: group, hideKickMemberOption: (chatFeatures && !chatFeatures?.moderatorControls?.kickUsers) ??
                                            !CometChatSettings.chatFeatures.moderatorControls.kickUsers, hideScopeChangeOption: (chatFeatures && !chatFeatures?.moderatorControls?.promoteDemoteMembers) ??
                                            !CometChatSettings.chatFeatures.moderatorControls.promoteDemoteMembers, 
                                        // hideKickMemberOption={callFeatures && !callFeatures?.voiceAndVideoCalling?.oneOnOneVideoCalling}
                                        hideBanMemberOption: (chatFeatures && !chatFeatures?.moderatorControls?.banUsers) ??
                                            !CometChatSettings.chatFeatures.moderatorControls.banUsers, hideUserStatus: (chatFeatures && !chatFeatures?.coreMessagingExperience?.userAndFriendsPresence) ??
                                            !CometChatSettings.chatFeatures.coreMessagingExperience.userAndFriendsPresence })) : groupTab === 'banned' ? (_jsx(CometChatBannedMembers, { group: group })) : null })] }))] }), showDeleteGroupChatDialog && getDeleteConversationConfirmationView(), showAddMembers && group ? addMembersView() : null, showLeaveGroup ? leaveGroupView() : null, showDeleteGroup ? deleteGroupView() : null, showTransferOwnership ? transferOwnershipView() : null, showTransferownershipDialog ? transferOwnershipDialogView() : null] }));
    });
    SideComponentGroup.displayName = 'SideComponentGroup';
    const SideComponentThread = (props) => {
        const { message } = props;
        const [requestBuilderState, setRequestBuilderState] = useState();
        const [showComposer, setShowComposer] = useState(true);
        const requestBuilder = useCallback(() => {
            const threadMessagesBuilder = new CometChat.MessagesRequestBuilder()
                .setCategories(CometChatUIKit.getDataSource().getAllMessageCategories())
                .setTypes(CometChatUIKit.getDataSource().getAllMessageTypes())
                .hideReplies(true)
                .setLimit(20)
                .setParentMessageId(message.getId());
            setRequestBuilderState(threadMessagesBuilder);
        }, [message]);
        useEffect(() => {
            requestBuilder();
            let currentUser = null;
            if (selectedItem instanceof CometChat.User) {
                currentUser = selectedItem;
            }
            else if (selectedItem instanceof CometChat.Conversation &&
                selectedItem.getConversationType() === CometChat.RECEIVER_TYPE.USER &&
                selectedItem.getConversationWith() instanceof CometChat.User) {
                currentUser = selectedItem.getConversationWith();
            }
            if (currentUser?.getBlockedByMe()) {
                setShowComposer(false);
            }
            const ccUserBlocked = CometChatUserEvents.ccUserBlocked.subscribe((blockedUser) => {
                if (blockedUser.getBlockedByMe()) {
                    setShowComposer(false);
                }
                updateUserAfterBlockUnblock(blockedUser);
            });
            const ccUserUnblocked = CometChatUserEvents.ccUserUnblocked.subscribe((unBlockedUser) => {
                if (!unBlockedUser.getBlockedByMe()) {
                    setShowComposer(true);
                }
                updateUserAfterBlockUnblock(unBlockedUser);
            });
            return () => {
                ccUserBlocked?.unsubscribe();
                ccUserUnblocked?.unsubscribe();
            };
        }, [message]);
        const onClose = () => {
            setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
            setAppState({ type: 'updateThreadSearchMessage', payload: undefined });
        };
        function closeMessageSeasrch() {
            setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
            setAppState({ type: 'updateShowMessagesSearch', payload: false });
        }
        return (_jsx(CometChatThreadedMessages, { searchKeyword: appState.goToMessageId ? appState.searchKeyword : undefined, message: message, requestBuilderState: requestBuilderState, selectedItem: selectedItem || freshChatRef.current.conversation, onClose: onClose, showComposer: showComposer, goToMessageId: appState.threadSearchMessage && appState.goToMessageId ? appState.goToMessageId : undefined, onSubtitleClicked: () => {
                if (isMobileView()) {
                    closeMessageSeasrch();
                }
                setAppState({ type: 'updateThreadSearchMessage', payload: undefined });
                setAppState({ type: 'updateGoToMessageId', payload: String(message.getId()) });
            } }));
    };
    useEffect(() => {
        if (newChat) {
            const convId = newChat.user?.getUid() || newChat.group?.getGuid();
            const convType = newChat.user
                ? CometChatUIKitConstants.MessageReceiverType.user
                : CometChatUIKitConstants.MessageReceiverType.group;
            CometChat.getConversation(convId, convType).then((conversation) => {
                setSelectedItem(conversation);
            }, () => {
                setSelectedItem(undefined);
            });
        }
    }, [newChat, newChat?.user, newChat?.group]);
    useEffect(() => {
        fetchDefaultConversation();
        setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
    }, [layoutFeatures?.chatType, defaultUser, defaultGroup]);
    const onSelectorItemClicked = (e, type) => {
        conversationItemClicked.current = true;
        setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
        setAppState({ type: 'updateThreadSearchMessage', payload: undefined });
        setAppState({ type: 'updateThreadedMessage', payload: undefined });
        setAppState({ type: 'updateGoToMessageId', payload: undefined });
        setAppState({ type: 'updateShowMessagesSearch', payload: false });
        setShowNewChat(false);
        if (type === 'updateSelectedItemGroup' && !e.getHasJoined()) {
            if (e.getType() === CometChatUIKitConstants.GroupTypes.public) {
                CometChat.joinGroup(e.getGuid(), e.getType())
                    .then((response) => {
                    setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                    setNewChat(undefined);
                    response.setHasJoined?.(true);
                    response.setScope?.(CometChatUIKitConstants.groupMemberScope.participant);
                    setSelectedItem(response);
                    setAppState({ type, payload: response });
                    setTimeout(() => {
                        CometChatGroupEvents.ccGroupMemberJoined.next({
                            joinedGroup: response,
                            joinedUser: loggedInUser,
                        });
                    }, 100);
                })
                    .catch((error) => {
                    console.error(error);
                });
            }
            else {
                setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                setNewChat(undefined);
                setGroup(e);
                setAppState({ type, payload: e });
                showJoinGroupRef.current = true;
            }
        }
        else {
            setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
            setNewChat(undefined);
            setAppState({ type, payload: e });
            setSelectedItem(activeTab === 'chats'
                ? e
                : activeTab === 'users'
                    ? e
                    : activeTab === 'groups'
                        ? e
                        : activeTab === 'calls'
                            ? e
                            : undefined);
        }
    };
    const subscribeToEvents = useCallback(() => {
        const ccConversationDeleted = CometChatConversationEvents.ccConversationDeleted.subscribe((conversation) => {
            if (conversation) {
                if (newChat?.user &&
                    conversation.getConversationType() === CometChatUIKitConstants.MessageReceiverType.user) {
                    if (conversation.getConversationWith().getUid() === newChat.user.getUid()) {
                        setNewChat(undefined);
                        setAppState({ type: 'newChat', payload: undefined });
                        setSelectedItem(undefined);
                        setAppState({ type: 'updateSelectedItem', payload: undefined });
                    }
                }
                else if (newChat?.group &&
                    conversation.getConversationType() === CometChatUIKitConstants.MessageReceiverType.group) {
                    if (conversation.getConversationWith().getGuid() === newChat.group.getGuid()) {
                        setNewChat(undefined);
                        setAppState({ type: 'newChat', payload: undefined });
                        setSelectedItem(undefined);
                        setAppState({ type: 'updateSelectedItem', payload: undefined });
                    }
                }
                else {
                    if (selectedItem?.getConversationId?.() === conversation.getConversationId?.()) {
                        setSelectedItem(undefined);
                        setAppState({ type: 'updateSelectedItem', payload: undefined });
                    }
                }
            }
        });
        const ccOpenChat = CometChatUIEvents.ccOpenChat.subscribe((item) => {
            openChatForUser(item.user);
        });
        const ccGroupJoineed = CometChatGroupEvents.ccGroupMemberJoined.subscribe((data) => {
            setGroup(data.joinedGroup);
            setSelectedItem(data.joinedGroup);
            setAppState({ type: 'updateSelectedItemGroup', payload: data.joinedGroup });
        });
        const ccClickEvent = CometChatUIEvents.ccMouseEvent.subscribe((mouseevent) => {
            if (mouseevent.event.type === 'click' &&
                mouseevent.body?.CometChatUserGroupMembersObject) {
                openChatForUser(mouseevent.body?.CometChatUserGroupMembersObject);
            }
        });
        const openChatForUser = (user) => {
            const uid = user?.getUid();
            const closeSide = () => {
                setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                setAppState({ type: 'updateThreadSearchMessage', payload: undefined });
                setAppState({ type: 'updateThreadedMessage', payload: undefined });
                setAppState({ type: 'updateGoToMessageId', payload: undefined });
                setAppState({ type: 'updateShowMessagesSearch', payload: false });
            };
            if (uid) {
                if (activeTab === 'chats') {
                    CometChat.getConversation(uid, CometChatUIKitConstants.MessageReceiverType.user).then((conversation) => {
                        if (!selectedItem ||
                            !(selectedItem instanceof CometChat.Conversation) ||
                            selectedItem?.getConversationId() !== conversation.getConversationId()) {
                            setNewChat(undefined);
                            setSelectedItem(conversation);
                            setAppState({ type: 'updateSelectedItem', payload: conversation });
                            closeSide();
                        }
                    }, (error) => {
                        setNewChat({ user, group: undefined });
                        setSelectedItem(undefined);
                        closeSide();
                    });
                }
                else if (activeTab === 'users') {
                    setNewChat(undefined);
                    setSelectedItem(user);
                    setAppState({ type: 'updateSelectedItemUser', payload: user });
                    closeSide();
                }
                else if (activeTab === 'groups') {
                    setNewChat({ user, group: undefined });
                    setSelectedItem(undefined);
                    closeSide();
                }
            }
        };
        return () => {
            ccConversationDeleted?.unsubscribe();
            ccOpenChat?.unsubscribe();
            ccClickEvent?.unsubscribe();
            ccGroupJoineed?.unsubscribe();
        };
    }, [newChat, selectedItem]);
    const attachSDKGroupListener = () => {
        const listenerId = 'BannedOrKickedMembers_GroupListener_' + String(Date.now());
        CometChat.addGroupListener(listenerId, new CometChat.GroupListener({
            onGroupMemberBanned: (message, kickedUser, kickedBy, kickedFrom) => {
                if ((selectedItem.getGuid?.() === kickedFrom.getGuid() ||
                    selectedItem.getConversationWith?.()?.getGuid?.() ===
                        kickedFrom.getGuid()) &&
                    kickedUser.getUid() === loggedInUser?.getUid()) {
                    setShowAlertPopup({ visible: true, description: getLocalizedString('member_banned') });
                }
            },
            onGroupMemberKicked: (message, kickedUser, kickedBy, kickedFrom) => {
                if ((selectedItem.getGuid?.() === kickedFrom.getGuid() ||
                    selectedItem.getConversationWith?.()?.getGuid?.() ===
                        kickedFrom.getGuid()) &&
                    kickedUser.getUid() === loggedInUser?.getUid()) {
                    setShowAlertPopup({ visible: true, description: getLocalizedString('member_removed') });
                }
            },
        }));
        return () => CometChat.removeGroupListener(listenerId);
    };
    useEffect(() => {
        if (loggedInUser) {
            const unsubscribeFromEvents = subscribeToEvents();
            const unsubscribeFromGroupEvents = attachSDKGroupListener();
            return () => {
                unsubscribeFromEvents();
                unsubscribeFromGroupEvents();
            };
        }
    }, [loggedInUser, subscribeToEvents, attachSDKGroupListener]);
    const removedFromGroup = () => {
        setShowAlertPopup({ visible: false, description: '' });
        setSelectedItem(undefined);
        setAppState({ type: 'updateSelectedItem', payload: undefined });
        setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
    };
    function closeToast() {
        setShowToast(false);
    }
    const getActiveItem = () => {
        if ((activeTab === 'chats' && selectedItem instanceof CometChat.Conversation) ||
            (activeTab === 'users' && selectedItem instanceof CometChat.User) ||
            (activeTab === 'groups' && selectedItem instanceof CometChat.Group) ||
            (activeTab === 'calls' && selectedItem instanceof CallLog)) {
            return selectedItem;
        }
        else {
            return undefined;
        }
    };
    const SideComponentWrapper = useMemo(() => {
        return _jsx(SideComponent, {});
    }, [appState.sideComponent, appState.showMessagesSearch, appState.sideComponentTop, appState.threadSearchMessage]);
    const openSearchComponent = () => {
        setAppState({ type: 'updateShowConversationsSearch', payload: true });
    };
    const closeSearch = () => {
        setAppState({ type: 'updateShowConversationsSearch', payload: false });
    };
    const resetSideComponent = (conversationId) => {
        if (selectedItem &&
            selectedItem instanceof CometChat.Conversation &&
            selectedItem.getConversationId() !== conversationId) {
            setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
            setAppState({ type: 'updateThreadSearchMessage', payload: undefined });
            setAppState({ type: 'updateThreadedMessage', payload: undefined });
            setAppState({ type: 'updateShowMessagesSearch', payload: false });
            activeSideComponentRef.current = '';
        }
    };
    const onConversationClicked = (conversation) => {
        resetSideComponent(conversation.getConversationId());
        if (!selectedItem ||
            !(selectedItem instanceof CometChat.Conversation) ||
            (selectedItem instanceof CometChat.Conversation &&
                selectedItem.getConversationId() !== conversation.getConversationId())) {
            setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
            setNewChat(undefined);
            setAppState({ type: 'updateSelectedItem', payload: conversation });
            setSelectedItem(conversation);
        }
    };
    const onMessageClicked = async (message, searchKeyword) => {
        try {
            resetSideComponent(message.getConversationId());
            if (!message.getParentMessageId() &&
                appState.sideComponent.visible &&
                appState.sideComponent.type === 'threadedMessage') {
                setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                setAppState({ type: 'updateThreadSearchMessage', payload: undefined });
                setAppState({ type: 'updateThreadedMessage', payload: undefined });
            }
            if (searchKeyword) {
                setAppState({ type: 'UpdateSearchKeyword', payload: searchKeyword });
            }
            const updateStates = async (conversation) => {
                if (message.getParentMessageId()) {
                    const msg = await CometChat.getMessageDetails(message.getParentMessageId());
                    if (msg) {
                        setAppState({ type: 'updateSideComponent', payload: { visible: true, type: 'threadedMessage' } });
                        setAppState({ type: 'updateThreadSearchMessage', payload: message });
                        setAppState({ type: 'updateThreadedMessage', payload: msg });
                        setAppState({ type: 'updateGoToMessageId', payload: String(message.getId()) });
                        setAppState({
                            type: 'updateSelectedItem',
                            payload: conversation,
                        });
                        setSelectedItem(conversation);
                        setNewChat(undefined);
                    }
                }
                else {
                    setAppState({ type: 'updateGoToMessageId', payload: String(message.getId()) });
                    setAppState({
                        type: 'updateSelectedItem',
                        payload: conversation,
                    });
                    setSelectedItem(conversation);
                    setNewChat(undefined);
                }
            };
            if (selectedItem instanceof CometChat.Conversation &&
                selectedItem.getConversationId() === message.getConversationId()) {
                updateStates(selectedItem);
            }
            else {
                const conversation = await CometChat.CometChatHelper.getConversationFromMessage(message);
                if (conversation) {
                    updateStates(conversation);
                }
            }
        }
        catch (error) {
            console.error('Error navigating to message:', error);
        }
    };
    const getTheme = () => {
        let theme = 'system';
        if (styleFeatures) {
            if (styleFeatures?.theme === 'system') {
                theme = colorScheme;
            }
            else {
                theme = styleFeatures?.theme;
            }
        }
        return theme;
    };
    return (loggedInUser && (_jsxs("div", { id: styleFeatures && `${styleFeatures?.theme}-theme`, className: "cometchat-root", "data-theme": styleFeatures && getTheme(), children: [showAlertPopup.visible && (_jsx(CometChatAlertPopup, { onConfirmClick: removedFromGroup, title: getLocalizedString('no_longer_part_of_group'), description: `${getLocalizedString('you_have_been')} ${showAlertPopup.description} ${getLocalizedString('removed_by_admin')}` })), _jsxs("div", { className: `conversations-wrapper ${!layoutFeatures?.withSideBar ? 'hide-sidebar' : ''}`, children: [_jsx("div", { className: "selector-wrapper", children: _jsx(CometChatSelector, { onSearchClicked: openSearchComponent, activeItem: getActiveItem(), activeTab: activeTab, group: group, onProtectedGroupJoin: (group) => setSelectedItem(group), onSelectorItemClicked: onSelectorItemClicked, setShowCreateGroup: setShowCreateGroup, showCreateGroup: showCreateGroup, showJoinGroup: showJoinGroupRef.current, onHide: () => (showJoinGroupRef.current = false), onNewChatClicked: () => {
                                setShowNewChat(true);
                                setAppState({ type: 'updateSideComponent', payload: { type: '', visible: false } });
                            }, onGroupCreated: (group) => {
                                setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                                setSelectedItem(group);
                            }, hideCreateGroupButton: (chatFeatures && !chatFeatures.groupManagement.createGroup) ??
                                !CometChatSettings.chatFeatures.groupManagement.createGroup }) }), _jsx(TabComponent, {}), appState.showConversationsSearch && (_jsx("div", { className: "selector-wrapper-search", children: _jsx(CometChatSearch, { onMessageClicked: onMessageClicked, onConversationClicked: onConversationClicked, hideBackButton: false, onBack: closeSearch }) }))] }), appState.goToMessageId && appState.threadSearchMessage ? null : (_jsx("div", { className: "messages-wrapper", children: _jsx(InformationComponent, {}) })), SideComponentWrapper, _jsx(CometChatIncomingCall, {}), showToast ? _jsx(CometChatToast, { text: toastTextRef.current, onClose: closeToast }) : null] })));
}
const MemoizedCometChatHome = React.memo(CometChatHome);
export { MemoizedCometChatHome as CometChatHome };
