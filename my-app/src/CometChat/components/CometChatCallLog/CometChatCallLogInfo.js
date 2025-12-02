import { jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import '../../styles/CometChatCallLog/CometChatCallLogInfo.css';
import { CometChatDate, CometChatListItem, CometChatLocalize, CometChatUIKit, CometChatUIKitConstants, convertMinutesToHoursMinutesSeconds, getLocalizedString, } from '@cometchat/chat-uikit-react';
export const CometChatCallDetailsInfo = (props) => {
    const { call } = props;
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [outgoingCallSuccess, setOutgoingCallSuccess] = useState(undefined);
    const [callRejectedIcon, setCallRejectedIcon] = useState(undefined);
    const [incomingCallIcon, setIncomingCallIcon] = useState(undefined);
    const [incomingCallSuccessIcon, setIncomingCallSuccessIcon] = useState(undefined);
    const [missedCallIcon, setMissedCallIcon] = useState(undefined);
    useEffect(() => {
        import('../../assets/outgoingCallSuccess.svg')
            .then((module) => setOutgoingCallSuccess(module.default?.src || module.default))
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
        return (_jsx("div", { className: "cometchat-call-log-info__subtitle", children: _jsx(CometChatDate, { calendarObject: getDateFormat(), timestamp: item?.getInitiatedAt() }) }));
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
        return (_jsx("div", { className: getCallDuration(item) ? 'cometchat-call-log-info__tail-view' : 'cometchat-call-log-info__tail-view-disabled', children: getCallDuration(item) ? getCallDuration(item) : '00:00' }));
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
    function getAvatarUrlForCall(call) {
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
    }
    return (_jsx("div", { className: "cometchat-call-log-info", children: loggedInUser && (_jsx(CometChatListItem, { title: getCallStatus(call, loggedInUser), avatarURL: getAvatarUrlForCall(call), subtitleView: getListItemSubtitleView(call), trailingView: getListItemTailView(call) })) }));
};
