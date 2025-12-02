import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react';
import '../../styles/CometChatCallLog/CometChatCallLogParticipants.css';
import { CometChatDate, CometChatList, CometChatListItem, CometChatLocalize, States, } from '@cometchat/chat-uikit-react';
export const CometChatCallDetailsParticipants = (props) => {
    const { call } = props;
    const getCallParticipants = useCallback(() => {
        return call?.getParticipants();
    }, [call]);
    function convertMinutesToHoursMinutesSeconds(minutes) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.floor(minutes % 60);
        const seconds = Math.floor((minutes - Math.floor(minutes)) * 60);
        let hoursString = '';
        let minutesString = '';
        let secondsString = '';
        if (hours > 0) {
            hoursString = `${hours}h`;
        }
        if (remainingMinutes > 0) {
            minutesString = `${remainingMinutes}m`;
        }
        if (seconds >= 0) {
            secondsString = `${seconds}s`;
        }
        return `${hoursString} ${minutesString} ${secondsString}`;
    }
    const getDurationOfCall = useCallback((item) => {
        if (item?.getHasJoined() || item?.getJoinedAt()) {
            return convertMinutesToHoursMinutesSeconds(item?.getTotalDurationInMinutes());
        }
        else {
            return convertMinutesToHoursMinutesSeconds(0);
        }
    }, []);
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
    const getListItemSubtitleView = useCallback(() => {
        return _jsx(CometChatDate, { timestamp: call.initiatedAt, calendarObject: getDateFormat() });
    }, [call]);
    const getListItemTailView = useCallback((item) => {
        return (_jsx("div", { className: item?.getHasJoined() || item?.getJoinedAt()
                ? 'cometchat-call-log-participants__tail-view'
                : 'cometchat-call-log-participants__tail-view-disabled', children: getDurationOfCall(item) }));
    }, [getDurationOfCall]);
    const getListItem = useMemo(() => {
        return function (item) {
            return (_jsx(_Fragment, { children: _jsx(CometChatListItem, { title: item?.getName(), avatarURL: item?.getAvatar(), avatarName: item?.getName(), subtitleView: getListItemSubtitleView(), trailingView: getListItemTailView(item) }) }));
        };
    }, [getListItemSubtitleView, getListItemTailView]);
    return (_jsx("div", { className: "cometchat-call-log-participants", children: _jsx(CometChatList, { hideSearch: true, list: getCallParticipants() || [], itemView: getListItem, listItemKey: "getUid", state: States.loaded, showSectionHeader: false }) }));
};
