import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useState } from 'react';
import '../../styles/CometChatAddMembers/CometChatAddMembers.css';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { useCometChatAddMembers } from './useCometChatAddMembers';
import backbutton from '../../assets/arrow_back.svg';
import { CometChatButton, CometChatGroupEvents, CometChatUIKitConstants, CometChatUIKitUtility, CometChatUsers, SelectionMode, getLocalizedString, useCometChatErrorHandler, useRefSync, } from '@cometchat/chat-uikit-react';
import { useCometChatContext } from '../../context/CometChatContext';
/**
 * Renders a scrollable list of users to add to a group of a CometChat App
 */
export function CometChatAddMembers(props) {
    const { chatFeatures } = useCometChatContext();
    const { showBackButton = false, onBack, hideSearch = false, showSectionHeader = false, sectionHeaderField = 'getName', loadingStateView, emptyStateView, errorStateView, hideError = false, onError, options, selectionMode = SelectionMode.multiple, onSelect, usersRequestBuilder: usersRequestBuilderProp, searchRequestBuilder, listItemView, subtitleView, group, onAddMembersButtonClick = null, buttonText = getLocalizedString('add_members'), } = props;
    // Build usersRequestBuilder with friendsOnly if needed
    let usersRequestBuilder = usersRequestBuilderProp;
    if (!usersRequestBuilder) {
        usersRequestBuilder = new CometChat.UsersRequestBuilder().setLimit(30);
        if (chatFeatures?.userManagement?.friendsOnly) {
            usersRequestBuilder = usersRequestBuilder.friendsOnly(true);
        }
    }
    const membersToAddRef = useRef([]);
    const selectionModeRef = useRef(selectionMode);
    const loggedInUserRef = useRef(null);
    const onSelectPropRef = useRefSync(onSelect);
    const groupPropRef = useRefSync(group);
    const onBackPropRef = useRefSync(onBack);
    const onAddMembersButtonClickPropRef = useRefSync(onAddMembersButtonClick);
    const errorHandler = useCometChatErrorHandler(onError);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isError, setIsError] = useState(false);
    /**
      /**
       * Creates a `CometChat.GroupMember` instance from the provided `user`
       */
    const createGroupMemberFromUser = useCallback((user) => {
        const groupMember = new CometChat.GroupMember(user.getUid(), CometChatUIKitConstants.groupMemberScope.participant);
        groupMember.setName(user.getName());
        groupMember.setGuid(groupPropRef.current.getGuid());
        groupMember.setAvatar(user?.getAvatar());
        groupMember.setStatus(user.getStatus());
        return groupMember;
    }, [groupPropRef]);
    const updateAddMembersList = useCallback((user) => {
        const targetUid = user.getUid();
        const tmpMembersToAddList = [];
        let updated = false;
        for (let i = 0; i < membersToAddRef.current.length; i++) {
            const curMember = membersToAddRef.current[i];
            if (targetUid === curMember.getUid()) {
                updated = true;
            }
            else {
                tmpMembersToAddList.push(curMember);
            }
        }
        if (!updated) {
            tmpMembersToAddList.push(createGroupMemberFromUser(user));
        }
        membersToAddRef.current = tmpMembersToAddList;
    }, [createGroupMemberFromUser]);
    /**
     * Updates `membersToAddRef`
     *
     * @remarks
     * This function makes sure `membersToAddRef` is in sync with the UI
     */
    const onSelectWrapper = useCallback((user, selected) => {
        if (onSelectPropRef.current) {
            return onSelectPropRef.current(user, selected);
        }
        if (selectionModeRef.current === SelectionMode.single) {
            membersToAddRef.current = [createGroupMemberFromUser(user)];
        }
        else if (selectionModeRef.current === SelectionMode.multiple) {
            updateAddMembersList(user);
        }
        if (membersToAddRef.current.length === 0) {
            setIsDisabled(true);
        }
        else {
            setIsDisabled(false);
        }
    }, [createGroupMemberFromUser, onSelectPropRef, updateAddMembersList]);
    /**
     * Creates a `CometChat.Action` instance
     */
    const createActionMessage = useCallback((actionOn, loggedInUser, group) => {
        const actionMessage = new CometChat.Action(group.getGuid(), CometChatUIKitConstants.MessageTypes.groupMember, CometChatUIKitConstants.MessageReceiverType.group, CometChatUIKitConstants.MessageCategory.action);
        actionMessage.setAction(CometChatUIKitConstants.groupMemberAction.ADDED);
        actionMessage.setActionBy(CometChatUIKitUtility.clone(loggedInUser));
        actionMessage.setActionFor(CometChatUIKitUtility.clone(group));
        actionMessage.setActionOn(CometChatUIKitUtility.clone(actionOn));
        actionMessage.setReceiver(CometChatUIKitUtility.clone(group));
        actionMessage.setSender(CometChatUIKitUtility.clone(loggedInUser));
        actionMessage.setConversationId('group_' + group.getGuid());
        actionMessage.setMuid(CometChatUIKitUtility.ID());
        actionMessage.setMessage(`${loggedInUser.getName()} added ${actionOn.getUid()}`);
        actionMessage.setSentAt(CometChatUIKitUtility.getUnixTimestamp());
        return actionMessage;
    }, []);
    /**
     * Provides a default behaviour to the `onAddMembersButtonClick` prop
     */
    const onAddBtnClickWrapper = useCallback(async () => {
        if (membersToAddRef.current.length === 0) {
            return;
        }
        setIsLoading(true);
        setIsError(false);
        try {
            const group = groupPropRef.current;
            const onAddBtnClick = onAddMembersButtonClickPropRef.current;
            if (onAddBtnClick) {
                onAddBtnClick(group.getGuid(), membersToAddRef.current);
                membersToAddRef.current = [];
                return;
            }
            const UIDsToRemove = new Set();
            const response = await CometChat.addMembersToGroup(group.getGuid(), membersToAddRef.current, []);
            setIsLoading(false);
            if (response) {
                for (const key in response) {
                    if (response[key] === 'success') {
                        UIDsToRemove.add(key);
                    }
                }
            }
            const addedMembers = [];
            for (let i = 0; i < membersToAddRef.current.length; i++) {
                const curMember = membersToAddRef.current[i];
                if (UIDsToRemove.has(curMember.getUid())) {
                    addedMembers.push(curMember);
                }
            }
            const loggedInUser = loggedInUserRef.current;
            if (loggedInUser) {
                const groupClone = CometChatUIKitUtility.clone(group);
                groupClone.setMembersCount(group.getMembersCount() + addedMembers.length);
                CometChatGroupEvents.ccGroupMemberAdded.next({
                    messages: addedMembers.map((addedMember) => createActionMessage(addedMember, loggedInUser, groupClone)),
                    usersAdded: addedMembers,
                    userAddedIn: groupClone,
                    userAddedBy: CometChatUIKitUtility.clone(loggedInUser),
                });
            }
            membersToAddRef.current = [];
            onBackPropRef.current?.();
        }
        catch (error) {
            setIsLoading(false);
            setIsError(true);
            errorHandler(error);
        }
    }, [errorHandler, createActionMessage, groupPropRef, onAddMembersButtonClickPropRef, onBackPropRef]);
    /**
     * Creates back button view
     */
    function getBackBtnView() {
        if (!showBackButton) {
            return null;
        }
        return (_jsx("div", { className: "cometchat-add-members__back-button", children: _jsx(CometChatButton, { iconURL: backbutton, onClick: onBack }) }));
    }
    /**
     * Creates add members button view
     */
    function getAddMembersBtnView() {
        return (_jsx("div", { className: `cometchat-add-members__add-btn-wrapper ${isDisabled ? 'cometchat-add-members__add-btn-wrapper-disabled' : ''}`, children: _jsx(CometChatButton, { isLoading: isLoading, text: buttonText, onClick: onAddBtnClickWrapper }) }));
    }
    const onUsersSelected = (user) => {
        updateAddMembersList(user);
        if (membersToAddRef.current.length === 0) {
            setIsDisabled(true);
        }
        else {
            setIsDisabled(false);
        }
    };
    useCometChatAddMembers({
        loggedInUserRef,
        errorHandler,
        selectionMode,
        selectionModeRef,
        membersToAddRef,
    });
    return (_jsxs("div", { className: "cometchat-add-members", children: [_jsx(CometChatUsers, { hideSearch: hideSearch, showSectionHeader: showSectionHeader, sectionHeaderKey: sectionHeaderField, loadingView: loadingStateView, emptyView: emptyStateView, errorView: errorStateView, hideError: hideError, onError: onError, options: options, selectionMode: selectionMode, onSelect: onSelectWrapper, usersRequestBuilder: usersRequestBuilder, searchRequestBuilder: searchRequestBuilder, itemView: listItemView, subtitleView: subtitleView, onItemClick: onUsersSelected, activeUser: undefined, hideUserStatus: chatFeatures && !chatFeatures?.coreMessagingExperience?.userAndFriendsPresence }), isError ? (_jsx("div", { className: "cometchat-add-members_error-view", children: getLocalizedString('member_error_subtitle') })) : null, getAddMembersBtnView(), getBackBtnView()] }));
}
