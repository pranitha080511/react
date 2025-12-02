import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react';
import '../../styles/CometChatCallLog/CometChatCallLogRecordings.css';
import { CometChatDate, CometChatList, CometChatListItem, CometChatLocalize, getLocalizedString, States, } from '@cometchat/chat-uikit-react';
export const CometChatCallDetailsRecording = (props) => {
    const { call } = props;
    const handleDownloadClick = useCallback((item) => {
        fetch(item?.getRecordingURL())
            .then((response) => {
            return response.blob();
        })
            .then((blob) => {
            const blobURL = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobURL;
            a.download = 'recording.mp4';
            document.body.appendChild(a);
            a.click();
        })
            .catch((error) => console.error(error));
    }, []);
    const getRecordings = useCallback(() => {
        try {
            return call?.getRecordings();
        }
        catch (e) {
            console.log(e);
        }
    }, [call]);
    const getRecordingStartTime = (item) => {
        try {
            return item?.getStartTime();
        }
        catch (e) {
            console.log(e);
        }
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
        return (_jsx("div", { className: "cometchat-call-log-recordings__subtitle", children: _jsx(CometChatDate, { calendarObject: getDateFormat(), timestamp: getRecordingStartTime(item) }) }));
    }, []);
    const getListItemTailView = useCallback((item) => {
        return _jsx("div", { className: "cometchat-call-log-recordings__download", onClick: () => handleDownloadClick(item) });
    }, [handleDownloadClick]);
    const getListItem = useMemo(() => {
        return function (item) {
            return (_jsx(_Fragment, { children: _jsx(CometChatListItem, { avatarURL: "", title: item?.getRid(), subtitleView: getListItemSubtitleView(item), trailingView: getListItemTailView(item) }) }));
        };
    }, [getListItemSubtitleView, getListItemTailView]);
    return (_jsx("div", { className: "cometchat-call-log-recordings", children: !getRecordings() ? (_jsxs("div", { className: "cometchat-call-log-recordings__empty-state", children: [_jsx("div", { className: "cometchat-call-log-recordings__empty-state-icon" }), _jsx("div", { className: "cometchat-call-log-recordings__empty-state-text", children: getLocalizedString('no_recording_available') })] })) : (_jsx(CometChatList, { hideSearch: true, list: getRecordings(), itemView: getListItem, listItemKey: "getRid", state: States.loaded, showSectionHeader: false })) }));
};
