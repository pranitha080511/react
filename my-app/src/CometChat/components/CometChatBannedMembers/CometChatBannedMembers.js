import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import unbanIconURL from '../../assets/close.svg';
import '../../styles/CometChatBannedMembers/CometChatBannedMembers.css';
import { CometChatButton, CometChatGroupEvents, CometChatList, CometChatListItem, CometChatUIKitLoginListener, States, getLocalizedString, } from '@cometchat/chat-uikit-react';
export const CometChatBannedMembers = (props) => {
    const { group } = props;
    const [bannedMembers, setBannedMembers] = useState([]);
    const [state, setState] = useState(States.loading);
    const bannedMembersRequestBuilderRef = useRef({});
    useEffect(() => {
        const GUID = group.getGuid();
        const limit = 30;
        const bannedMembersRequest = new CometChat.BannedMembersRequestBuilder(GUID).setLimit(limit).build();
        bannedMembersRequest.fetchNext().then((bannedMembers) => {
            setBannedMembers(bannedMembers);
        }, (error) => {
            console.error('Banned Group Member list fetching failed with exception:', error);
        });
    }, [group]);
    const unbanMember = useCallback(async (bannedMember) => {
        try {
            CometChat.unbanGroupMember(group.getGuid(), bannedMember.getUid()).then(() => {
                const unbannedUser = {
                    unbannedUser: bannedMember,
                    unbannedBy: CometChatUIKitLoginListener.getLoggedInUser(),
                    unbannedFrom: group,
                };
                CometChatGroupEvents.ccGroupMemberUnbanned.next(unbannedUser);
                setBannedMembers((prevState) => {
                    const filteredMembers = prevState.filter((filterMember) => {
                        return bannedMember.getUid() !== filterMember.getUid();
                    });
                    return filteredMembers;
                });
            });
        }
        catch (error) {
            console.log(error);
        }
    }, [group]);
    function getDefaultListTailView(bannedMember) {
        return (_jsx(CometChatButton, { iconURL: unbanIconURL, onClick: () => unbanMember(bannedMember), hoverText: getLocalizedString('unban') }));
    }
    /**
     * Creates default list item view
     */
    function getListItem() {
        return function (bannedMember) {
            return (_jsx(CometChatListItem, { id: bannedMember.getUid(), title: bannedMember.getName(), avatarURL: bannedMember.getAvatar(), avatarName: bannedMember.getName(), trailingView: getDefaultListTailView(bannedMember) }));
        };
    }
    const fetchNextAndAppendBannedMembers = useCallback(async () => {
        try {
            setState(States.loading);
            if (Object.keys(bannedMembersRequestBuilderRef.current).length === 0) {
                const finalBannedMembersRequestBuilder = new CometChat.BannedMembersRequestBuilder(group.getGuid())
                    .setLimit(30)
                    .build();
                bannedMembersRequestBuilderRef.current = finalBannedMembersRequestBuilder;
            }
            const bannedMembersList = await bannedMembersRequestBuilderRef.current.fetchNext();
            if (bannedMembersList.length !== 0) {
                setBannedMembers((prevState) => {
                    const list = [...prevState, ...bannedMembersList];
                    const unique = list.filter((obj1, i, arr) => arr.findIndex((obj2) => obj2.uid === obj1.uid) === i);
                    return unique;
                });
            }
            setState(States.loaded);
        }
        catch (error) {
            console.log(error);
            setState(States.error);
        }
    }, [group, bannedMembersRequestBuilderRef]);
    useEffect(
    /**
     * Creates a new request builder -> empties the `bannedMembers` state -> initiates a new fetch
     */
    () => {
        fetchNextAndAppendBannedMembers();
    }, [fetchNextAndAppendBannedMembers, group]);
    const subscribeToEvents = useCallback(() => {
        const groupMemberBannedSub = CometChatGroupEvents.ccGroupMemberBanned.subscribe((item) => {
            const { kickedFrom, kickedUser } = item;
            if (kickedFrom.getGuid() === group.getGuid()) {
                setBannedMembers((prevState) => {
                    return [...prevState, kickedUser];
                });
            }
        });
        const groupMemberUnbannedSub = CometChatGroupEvents.ccGroupMemberUnbanned.subscribe((item) => {
            const { unbannedFrom, unbannedUser } = item;
            if (unbannedFrom.getGuid() === group.getGuid()) {
                setBannedMembers((prevState) => {
                    const filteredMembers = prevState.filter((filterMember) => {
                        return unbannedUser.getUid() !== filterMember.getUid();
                    });
                    return filteredMembers;
                });
            }
        });
        return () => {
            groupMemberBannedSub.unsubscribe();
            groupMemberUnbannedSub.unsubscribe();
        };
    }, [group]);
    const attachSDKGroupListener = useCallback(() => {
        const listenerId = 'BannedMembers_GroupListener_' + String(Date.now());
        CometChat.addGroupListener(listenerId, new CometChat.GroupListener({
            onGroupMemberBanned: (message, kickedUser, kickedBy, kickedFrom) => {
                if (group.getGuid() !== kickedFrom.getGuid()) {
                    return;
                }
                CometChatGroupEvents.ccGroupMemberBanned.next({ message, kickedBy, kickedFrom, kickedUser });
            },
            onGroupMemberUnbanned: (message, unbannedUser, unbannedBy, unbannedFrom) => {
                if (group.getGuid() !== unbannedFrom.getGuid()) {
                    return;
                }
                CometChatGroupEvents.ccGroupMemberUnbanned.next({ message, unbannedBy, unbannedFrom, unbannedUser });
            },
        }));
        return () => CometChat.removeGroupListener(listenerId);
    }, [group]);
    useEffect(() => {
        const unsubscribeFromEvents = subscribeToEvents();
        const unsubscribeFromSDKEvents = attachSDKGroupListener();
        return () => {
            unsubscribeFromEvents();
            unsubscribeFromSDKEvents();
        };
    }, [subscribeToEvents, attachSDKGroupListener]);
    return (_jsx("div", { className: "cometchat-banned-members", children: state === States.loading ? (_jsx("div", { className: "cometchat-banned-members__shimmer", children: [...Array(3)].map((_, index) => (_jsxs("div", { className: "cometchat-banned-members__shimmer-item", children: [_jsx("div", { className: "cometchat-banned-members__shimmer-item-avatar" }), _jsx("div", { className: "cometchat-banned-members__shimmer-item-title" })] }, index))) })) : (_jsx(_Fragment, { children: bannedMembers.length === 0 ? (_jsxs("div", { className: "cometchat-banned-members__empty", children: [_jsx("div", { className: "cometchat-banned-members__empty-icon" }), _jsx("div", { className: "cometchat-banned-members__empty-text", children: getLocalizedString('no_banned_members') })] })) : (_jsx(CometChatList, { hideSearch: true, list: bannedMembers, listItemKey: "getUid", itemView: getListItem(), showSectionHeader: false, onScrolledToBottom: () => fetchNextAndAppendBannedMembers(), state: bannedMembers.length === 0 ? States.loading : States.loaded })) })) }));
};
