import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/CometChatCallLog/CometChatCallLogHistory.css';
import { CometChatDate, CometChatList, CometChatListItem, CometChatLocalize, CometChatUIKit, CometChatUIKitCalls, CometChatUIKitConstants, States, convertMinutesToHoursMinutesSeconds, getLocalizedString, } from '@cometchat/chat-uikit-react';
export const CometChatCallDetailsHistory = (props) => {
    const { call } = props;
    const [callList, setCallList] = useState([]);
    const [callListState, setCallListState] = useState(States.loading);
    const requestBuilder = useRef(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [outgoingCallSuccess, setOutgoingCallSuccess] = useState(undefined);
    const [callRejectedIcon, setCallRejectedIcon] = useState(undefined);
    const [incomingCallIcon, setIncomingCallIcon] = useState(undefined);
    const [incomingCallSuccessIcon, setIncomingCallSuccessIcon] = useState(undefined);
    const [missedCallIcon, setMissedCallIcon] = useState(undefined);
    useEffect(() => {
        import('../../assets/outgoingCallSuccess.svg')
            .then((module) => {
            setOutgoingCallSuccess(module.default?.src || module.default);
        })
            .catch((error) => console.error('Error loading SVG:', error));
        import('../../assets/callRejectedIcon.svg')
            .then((module) => setCallRejectedIcon(module.default?.src || module.default))
            .catch((error) => console.error('Error loading SVG:', error));
        import('../../assets/incomingCallIcon.svg')
            .then((module) => setIncomingCallIcon(module.default?.src || module.default))
            .catch((error) => console.error('Error loading SVG:', error));
        import('../../assets/incomingCallSuccess.svg')
            .then((module) => setIncomingCallSuccessIcon(module.default?.src || module.default))
            .catch((error) => console.error('Error loading SVG:', error));
        import('../../assets/missedCallIcon.svg')
            .then((module) => setMissedCallIcon(module.default?.src || module.default))
            .catch((error) => console.error('Error loading SVG:', error));
    }, []);
    useEffect(() => {
        CometChatUIKit.getLoggedinUser().then((user) => {
            setLoggedInUser(user);
        });
    }, [setLoggedInUser]);
    const setRequestBuilder = useCallback(() => {
        try {
            let builder;
            let callUserId;
            if (call.getInitiator().getUid() === loggedInUser.getUid()) {
                callUserId = call.getReceiver().getUid();
            }
            else {
                callUserId = call.getInitiator().getUid();
            }
            const authToken = loggedInUser.getAuthToken() || '';
            builder = new CometChatUIKitCalls.CallLogRequestBuilder()
                .setLimit(30)
                .setCallCategory('call')
                .setAuthToken(authToken);
            if (callUserId) {
                builder = builder.setUid(callUserId);
            }
            return builder.build();
        }
        catch (e) {
            console.log(e);
        }
    }, [call, loggedInUser]);
    const fetchNextCallList = useCallback(async () => {
        try {
            const calls = await requestBuilder?.current?.fetchNext();
            return calls;
        }
        catch (e) {
            console.log(e);
            throw new Error('Error while fetching call list');
        }
    }, [requestBuilder]);
    const getCallList = useCallback(async () => {
        try {
            const calls = await fetchNextCallList();
            if (calls && calls.length > 0) {
                setCallList((prevCallList) => {
                    return [...prevCallList, ...calls];
                });
                setCallListState(States.loaded);
            }
            else if (callList.length === 0) {
                setCallListState(States.empty);
            }
        }
        catch (e) {
            console.log(e);
            if (callList.length === 0) {
                setCallListState(States.error);
            }
        }
    }, [fetchNextCallList, setCallList, setCallListState, callList]);
    useEffect(() => {
        if (loggedInUser) {
            requestBuilder.current = setRequestBuilder();
            getCallList?.();
        }
    }, [loggedInUser]);
    const getLoadingView = () => {
        return (_jsx("div", { className: "cometchat-call-log-history__shimmer", children: [...Array(10)].map((_, index) => (_jsxs("div", { className: "cometchat-call-log-history__shimmer-item", children: [_jsx("div", { className: "cometchat-call-log-history__shimmer-item-avatar" }), _jsxs("div", { className: "cometchat-call-log-history__shimmer-item-body", children: [_jsxs("div", { className: "cometchat-call-log-history__shimmer-item-body-title-wrapper", children: [_jsx("div", { className: "cometchat-call-log-history__shimmer-item-body-title" }), _jsx("div", { className: "cometchat-call-log-history__shimmer-item-body-subtitle" })] }), _jsx("div", { className: "cometchat-call-log-history__shimmer-item-body-tail" })] })] }, index))) }));
    };
    function getDateFormat() {
        const defaultFormat = {
            yesterday: `DD MMM, hh:mm A`,
            otherDays: `DD MMM, hh:mm A`,
            today: `DD MMM, hh:mm A`,
        };
        const finalFormat = {
            ...defaultFormat,
            ...CometChatLocalize.calendarObject,
        };
        return finalFormat;
    }
    const getListItemSubtitleView = useCallback((item) => {
        return (_jsx("div", { className: "cometchat-call-log-history__subtitle", children: _jsx(CometChatDate, { calendarObject: getDateFormat(), timestamp: item?.getInitiatedAt() }) }));
    }, []);
    const getCallDuration = useCallback((item) => {
        try {
            if (item?.getTotalDurationInMinutes()) {
                return convertMinutesToHoursMinutesSeconds(item?.getTotalDurationInMinutes());
            }
            else {
                return false;
            }
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }, []);
    const getListItemTailView = useCallback((item) => {
        return (_jsx("div", { className: getCallDuration(item)
                ? 'cometchat-call-log-history__tail-view'
                : 'cometchat-call-log-history__tail-view-disabled', children: getCallDuration(item) ? getCallDuration(item) : '00:00' }));
    }, [getCallDuration]);
    const getCallStatus = (call, loggedInUser) => {
        const isSentByMe = (call, loggedInUser) => {
            const senderUid = call.callInitiator?.getUid();
            return !senderUid || senderUid === loggedInUser?.getUid();
        };
        const callStatus = call.getStatus();
        const isSentByMeFlag = isSentByMe(call, loggedInUser);
        if (isSentByMeFlag) {
            switch (callStatus) {
                case CometChatUIKitConstants.calls.initiated:
                    return getLocalizedString('calls_outgoing_call');
                case CometChatUIKitConstants.calls.cancelled:
                    return getLocalizedString('calls_cancelled_call');
                case CometChatUIKitConstants.calls.rejected:
                    return getLocalizedString('calls_rejected_call');
                case CometChatUIKitConstants.calls.busy:
                    return getLocalizedString('calls_missed_call');
                case CometChatUIKitConstants.calls.ended:
                    return getLocalizedString('calls_ended_call');
                case CometChatUIKitConstants.calls.ongoing:
                    return getLocalizedString('calls_answered_call');
                case CometChatUIKitConstants.calls.unanswered:
                    return getLocalizedString('calls_unanswered_call');
                default:
                    return getLocalizedString('calls_outgoing_call');
            }
        }
        else {
            switch (callStatus) {
                case CometChatUIKitConstants.calls.initiated:
                    return getLocalizedString('calls_incoming_call');
                case CometChatUIKitConstants.calls.ongoing:
                    return getLocalizedString('calls_answered_call');
                case CometChatUIKitConstants.calls.ended:
                    return getLocalizedString('calls_ended_call');
                case CometChatUIKitConstants.calls.unanswered:
                case CometChatUIKitConstants.calls.cancelled:
                    return getLocalizedString('calls_missed_call');
                case CometChatUIKitConstants.calls.busy:
                    return getLocalizedString('calls_busy_call');
                case CometChatUIKitConstants.calls.rejected:
                    return getLocalizedString('calls_rejected_call');
                default:
                    return getLocalizedString('calls_outgoing_call');
            }
        }
    };
    const getAvatarUrlForCall = useCallback((call) => {
        const isSentByMe = (call, loggedInUser) => {
            const senderUid = call.initiator?.getUid();
            return !senderUid || senderUid === loggedInUser?.getUid();
        };
        const isSentByMeFlag = isSentByMe(call, loggedInUser);
        const callStatus = getCallStatus(call, loggedInUser);
        if (isSentByMeFlag) {
            switch (callStatus) {
                case getLocalizedString('calls_outgoing_call'):
                    return outgoingCallSuccess;
                case getLocalizedString('calls_incoming_call'):
                    return outgoingCallSuccess;
                case getLocalizedString('calls_cancelled_call'):
                    return outgoingCallSuccess;
                case getLocalizedString('calls_rejected_call'):
                    return callRejectedIcon;
                case getLocalizedString('calls_busy_call'):
                    return missedCallIcon;
                case getLocalizedString('calls_ended_call'):
                    return outgoingCallSuccess;
                case getLocalizedString('calls_answered_call'):
                    return outgoingCallSuccess;
                case getLocalizedString('calls_unanswered_call'):
                    return missedCallIcon;
                case getLocalizedString('calls_missed_call'):
                    return missedCallIcon;
                default:
                    return '';
            }
        }
        else {
            switch (callStatus) {
                case getLocalizedString('calls_outgoing_call'):
                    return incomingCallSuccessIcon;
                case getLocalizedString('calls_incoming_call'):
                    return incomingCallSuccessIcon;
                case getLocalizedString('calls_cancelled_call'):
                    return incomingCallIcon;
                case getLocalizedString('calls_rejected_call'):
                    return callRejectedIcon;
                case getLocalizedString('calls_busy_call'):
                    return missedCallIcon;
                case getLocalizedString('calls_ended_call'):
                    return incomingCallSuccessIcon;
                case getLocalizedString('calls_answered_call'):
                    return incomingCallSuccessIcon;
                case getLocalizedString('calls_unanswered_call'):
                    return missedCallIcon;
                case getLocalizedString('calls_missed_call'):
                    return missedCallIcon;
                default:
                    return '';
            }
        }
    }, [loggedInUser, outgoingCallSuccess, callRejectedIcon, incomingCallIcon, incomingCallSuccessIcon, missedCallIcon]);
    const getListItem = useMemo(() => {
        return function (item) {
            return (_jsx(_Fragment, { children: _jsx(CometChatListItem, { title: getCallStatus(item, loggedInUser), avatarURL: getAvatarUrlForCall(item), subtitleView: getListItemSubtitleView(item), trailingView: getListItemTailView(item) }) }));
        };
    }, [
        getAvatarUrlForCall,
        getListItemSubtitleView,
        getListItemTailView,
        loggedInUser,
        outgoingCallSuccess,
        callRejectedIcon,
        incomingCallIcon,
        incomingCallSuccessIcon,
        missedCallIcon,
    ]);
    return (_jsx("div", { className: "cometchat-call-log-history", children: callListState === States.loading ? (getLoadingView()) : (_jsx(CometChatList, { hideSearch: true, list: callList, onScrolledToBottom: getCallList, listItemKey: "getSessionID", itemView: getListItem, state: callListState, showSectionHeader: false })) }));
};
