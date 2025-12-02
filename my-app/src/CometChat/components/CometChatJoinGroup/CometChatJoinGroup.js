import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import '../../styles/CometChatSelector/CometChatSelector.css';
import { CometChatAvatar, CometChatButton, CometChatGroupEvents, CometChatUIKitLoginListener, getLocalizedString, } from '@cometchat/chat-uikit-react';
export const CometChatJoinGroup = (props) => {
    const { group, onHide = () => { }, onProtectedGroupJoin = () => { } } = props;
    const [password, setPassword] = useState('');
    const [showWrongPassword, setShowWrongPassword] = useState(false);
    const loggedInUser = CometChatUIKitLoginListener.getLoggedInUser();
    const { appState, setAppState } = useContext(AppContext);
    const inputRef = useRef(null);
    const onPasswordChange = (e) => {
        setShowWrongPassword(false);
        setPassword(e.target.value);
    };
    const joinPrivateGroup = () => {
        CometChat.joinGroup(group.getGuid(), group.getType(), password)
            .then((response) => {
            setAppState({ type: 'updateShowJoinGroup', payload: false });
            onHide();
            setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
            if (appState.activeTab === 'groups') {
                setAppState({ type: 'newChat', payload: undefined });
                setAppState({ type: 'updateSelectedItemGroup', payload: group });
            }
            else if (appState.activeTab === 'chats') {
                setAppState({ type: 'newChat', payload: { group, user: undefined } });
            }
            onProtectedGroupJoin(group);
            setTimeout(() => {
                CometChatGroupEvents.ccGroupMemberJoined.next({
                    joinedGroup: response,
                    joinedUser: loggedInUser,
                });
            }, 100);
        })
            .catch((error) => {
            setShowWrongPassword(true);
            console.error(error);
        });
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [group]);
    return (_jsx("div", { className: "join-group-password__wrapper", children: _jsxs("div", { className: "join-group-password", children: [_jsxs("div", { className: "join-group-password__header", children: [_jsx("div", { className: "join-group-password__header-title", children: getLocalizedString('group_password') }), _jsx("div", { className: "join-group-password__header-close", onClick: () => {
                                setAppState({ type: 'updateShowJoinGroup', payload: false });
                                onHide();
                            } })] }), _jsxs("div", { className: "join-group-password__content", children: [_jsx("div", { className: "join-group-password__content-avatar", children: _jsx(CometChatAvatar, { image: group.getIcon(), name: group.getName() }) }), _jsxs("div", { className: "join-group-password__content-text", children: [_jsx("div", { className: "join-group-password__content-text-title", children: group.getName() }), _jsx("div", { className: "join-group-password__content-text-subtitle", children: group.getMembersCount() + ' ' + getLocalizedString('group_members') })] })] }), _jsxs("div", { className: "join-group-password__input", children: [_jsx("div", { className: "join-group-password__input-label", children: getLocalizedString('group_password') }), _jsx("input", { ref: inputRef, placeholder: getLocalizedString('enter_your_password'), value: password, onChange: onPasswordChange }), showWrongPassword && (_jsx("div", { className: "join-group-password__input-wrong", children: getLocalizedString('invalid_password') }))] }), _jsx("div", { className: "join-group-password__button", children: _jsx(CometChatButton, { text: getLocalizedString('continue'), onClick: joinPrivateGroup }) })] }) }));
};
