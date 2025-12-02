import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import '../../styles/CometChatCallLog/CometChatCallLogDetails.css';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { CometChatCallDetailsInfo } from './CometChatCallLogInfo';
import { CometChatCallDetailsParticipants } from './CometChatCallLogParticipants';
import { CometChatCallDetailsRecording } from './CometChatCallLogRecordings';
import { CometChatCallDetailsHistory } from './CometChatCallLogHistory';
import { CometChatCallButtons, CometChatListItem, CometChatUIKitConstants, CometChatUIKitLoginListener, getLocalizedString, MessageUtils, } from '@cometchat/chat-uikit-react';
import { useCometChatContext } from '../../context/CometChatContext';
export const CometChatCallDetails = (props) => {
    const { selectedItem, onBack } = props;
    const callDetailTabItems = [
        {
            id: 'participants',
            name: getLocalizedString('participants'),
        },
        {
            id: 'recording',
            name: getLocalizedString('recording'),
        },
        {
            id: 'history',
            name: getLocalizedString('history'),
        },
    ];
    const [activeTab, setActiveTab] = useState('participants');
    const [user, setUser] = useState();
    const [subtitleText, setSubtitleText] = useState();
    const { callFeatures, chatFeatures } = useCometChatContext();
    function verifyCallUser(call, loggedInUser) {
        if (call.getInitiator().getUid() === loggedInUser.getUid()) {
            return call.getReceiver();
        }
        else {
            return call.getInitiator();
        }
    }
    useEffect(() => {
        const isBlocked = new MessageUtils().getUserStatusVisible(user);
        const userListenerId = 'users_custom' + Date.now();
        if (isBlocked) {
            setSubtitleText('');
            return;
        }
        setSubtitleText(getLocalizedString(`call_logs_user_status_${user?.getStatus().toLowerCase()}`));
        CometChat.addUserListener(userListenerId, new CometChat.UserListener({
            onUserOnline: (onlineUser) => {
                if (user?.getUid() === onlineUser.getUid()) {
                    setSubtitleText(getLocalizedString(`call_logs_user_status_online`));
                }
            },
            onUserOffline: (offlineUser) => {
                if (user?.getUid() === offlineUser?.getUid()) {
                    setSubtitleText(getLocalizedString(`call_logs_user_status_offline`));
                }
            },
        }));
        return () => {
            CometChat.removeUserListener(userListenerId);
        };
    }, [user]);
    useEffect(() => {
        const loggedInUser = CometChatUIKitLoginListener.getLoggedInUser();
        const callUser = verifyCallUser(selectedItem, loggedInUser);
        if (selectedItem.receiverType === CometChatUIKitConstants.MessageReceiverType.user) {
            CometChat.getUser(callUser.uid).then((response) => {
                setUser(response);
            });
        }
    }, [selectedItem]);
    const getSubtitleView = useCallback(() => {
        return (_jsx("div", { className: `cometchat-call-log-details__subtitle`, children: chatFeatures && chatFeatures?.coreMessagingExperience?.userAndFriendsPresence ? subtitleText : '' }));
    }, [subtitleText, chatFeatures]);
    function getTrailingView() {
        return (_jsx("div", { className: `cometchat-call-log-details__trailing-view`, children: _jsx(CometChatCallButtons, { user: user, hideVideoCallButton: !callFeatures?.voiceAndVideoCalling?.oneOnOneVideoCalling, hideVoiceCallButton: !callFeatures?.voiceAndVideoCalling?.oneOnOneVoiceCalling }, 'callbuttonsVCBSampleApp') }));
    }
    return (_jsxs("div", { className: "cometchat-call-log-details", children: [_jsxs("div", { className: "cometchat-call-log-details__header", children: [_jsx("div", { className: "cometchat-call-log-details__header-back", onClick: onBack }), getLocalizedString('call_details')] }), _jsx("div", { className: "cometchat-call-log-details__call-log-item", children: _jsx(CometChatListItem, { avatarName: user?.getName(), avatarURL: user?.getAvatar(), title: user?.getName() || '', subtitleView: getSubtitleView(), trailingView: getTrailingView() }) }), _jsx(CometChatCallDetailsInfo, { call: selectedItem }), _jsx("div", { className: "cometchat-call-log-details__tabs", children: callDetailTabItems.map((tabItem) => (_jsx("div", { onClick: () => setActiveTab(tabItem.id), className: activeTab === tabItem.id
                        ? 'cometchat-call-log-details__tabs-tab-item-active'
                        : 'cometchat-call-log-details__tabs-tab-item', children: tabItem.name }, tabItem.id))) }), _jsx(_Fragment, { children: activeTab === 'participants' ? (_jsx(CometChatCallDetailsParticipants, { call: selectedItem })) : activeTab === 'recording' ? (_jsx(CometChatCallDetailsRecording, { call: selectedItem })) : activeTab === 'history' ? (_jsx(CometChatCallDetailsHistory, { call: selectedItem })) : null })] }));
};
