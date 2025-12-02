import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState } from 'react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { useCometChatTransferOwnership } from './useCometChatTransferOwnership';
import '../../styles/CometChatTransferOwnership/CometChatTransferOwnership.css';
import { CometChatButton, CometChatGroupEvents, CometChatGroupMembers, CometChatRadioButton, CometChatUIKitConstants, CometChatUIKitUtility, SelectionMode, getLocalizedString, useCometChatErrorHandler, useRefSync, } from '@cometchat/chat-uikit-react';
import { useCometChatContext } from '../../context/CometChatContext';
import { CometChatSettings } from '../../CometChatSettings';
/**
 * Renders transfer ownership view related to a group of a CometChat App
 */
export function CometChatTransferOwnership(props) {
    const { group, hideSearch = false, groupMembersRequestBuilder, searchRequestBuilder, loadingStateView, emptyStateView, errorStateView, onError, onClose, listItemView, subtitleView, transferButtonText = getLocalizedString('transfer'), cancelButtonText = getLocalizedString('cancel'), options, } = props;
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const selectedMemberRef = useRef(null);
    const errorHandler = useCometChatErrorHandler(onError);
    const groupPropRef = useRefSync(group);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { chatFeatures } = useCometChatContext();
    /**
     * Changes `selectedMemberRef` reference
     */
    function onSelect(groupMember) {
        if (isDisabled) {
            setIsDisabled(false);
        }
        selectedMemberRef.current = groupMember;
    }
    /**
     * Creates tail view
     */
    function tailView(groupMember) {
        const scope = group.getOwner() === groupMember.getUid()
            ? CometChatUIKitConstants.groupMemberScope.owner
            : groupMember.getScope();
        if (group.getOwner() === groupMember.getUid()) {
            return _jsx(_Fragment, {});
        }
        else {
            return (_jsx("div", { children: _jsx(CometChatRadioButton, { name: 'transfer-ownership', id: groupMember.getUid(), labelText: getLocalizedString('member_scope_' + scope), onRadioButtonChanged: () => onSelect(groupMember) }) }));
        }
    }
    /**
     * Provides a default behavior to the `onTransferOwnership` prop
     */
    const onTransferOwnershipWrapper = useCallback(async () => {
        const selectedMember = selectedMemberRef.current;
        if (!selectedMember) {
            return;
        }
        setIsError(false);
        setIsLoading(true);
        try {
            const currentGroup = groupPropRef.current;
            await CometChat.transferGroupOwnership(currentGroup.getGuid(), selectedMember.getUid());
            setIsLoading(false);
            if (loggedInUser) {
                const groupClone = CometChatUIKitUtility.clone(currentGroup);
                groupClone.setOwner(selectedMember.getUid());
                CometChatGroupEvents.ccOwnershipChanged.next({
                    group: groupClone,
                    newOwner: CometChatUIKitUtility.clone(selectedMember),
                });
                if (onClose) {
                    onClose();
                }
            }
            selectedMemberRef.current = null;
        }
        catch (error) {
            setIsLoading(false);
            setIsError(true);
            errorHandler(error);
        }
    }, [groupPropRef, loggedInUser, onClose, errorHandler]);
    /**
     * Creates confirm button view
     */
    function getConfirmButtonView() {
        return (_jsx("div", { className: `cometchat-transfer-ownership__transfer-button ${isDisabled ? 'cometchat-transfer-ownership__transfer-button-disabled' : ''}`, children: _jsx(CometChatButton, { text: transferButtonText, disabled: isDisabled, isLoading: isLoading, onClick: onTransferOwnershipWrapper }) }));
    }
    /**
     * Creates cancel button view
     */
    function getCancelButtonView() {
        return (_jsx("div", { className: "cometchat-transfer-ownership__cancel-button", children: _jsx(CometChatButton, { text: cancelButtonText, onClick: onClose }) }));
    }
    useCometChatTransferOwnership({
        errorHandler,
        setLoggedInUser,
    });
    return (_jsxs("div", { className: "cometchat-transfer-ownership", children: [_jsx(CometChatGroupMembers, { hideError: undefined, onItemClick: undefined, options: options, group: group, hideSearch: hideSearch, groupMemberRequestBuilder: groupMembersRequestBuilder, searchRequestBuilder: searchRequestBuilder, loadingView: loadingStateView, emptyView: emptyStateView, errorView: errorStateView, onError: errorHandler, selectionMode: SelectionMode.none, itemView: listItemView, subtitleView: subtitleView, trailingView: tailView, hideUserStatus: (chatFeatures && !chatFeatures?.coreMessagingExperience?.userAndFriendsPresence) ??
                    !CometChatSettings.chatFeatures.coreMessagingExperience.userAndFriendsPresence }), _jsxs("div", { className: "cometchat-transfer-ownership__buttons-wrapper", children: [isError ? _jsx("div", { className: "cometchat-transfer-ownership_error-view", children: getLocalizedString('error') }) : null, _jsxs("div", { className: "cometchat-transfer-ownership__buttons", children: [getCancelButtonView(), getConfirmButtonView()] })] })] }));
}
