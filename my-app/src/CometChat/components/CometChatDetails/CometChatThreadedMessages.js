import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import '../../styles/CometChatDetails/CometChatThreadedMessages.css';
import { CometChatMessageComposer, CometChatMessageList, CometChatTextHighlightFormatter, CometChatThreadHeader, CometChatUIKit, CometChatUserEvents, getLocalizedString, } from '@cometchat/chat-uikit-react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import React from 'react';
import { useCometChatContext } from '../../context/CometChatContext';
import { CometChatSettings } from '../../CometChatSettings';
export const CometChatThreadedMessages = (props) => {
    const { message, requestBuilderState, selectedItem, onClose = () => { }, showComposer = false, onSubtitleClicked, goToMessageId, searchKeyword, } = props;
    const { chatFeatures } = useCometChatContext();
    // Memoize mentionsUsersRequestBuilder to respect friendsOnly toggle
    const mentionsUsersRequestBuilder = React.useMemo(() => {
        let builder = new CometChat.UsersRequestBuilder().setLimit(15);
        if (chatFeatures?.userManagement?.friendsOnly) {
            builder = builder.friendsOnly(true);
        }
        return builder;
    }, [chatFeatures?.userManagement?.friendsOnly]);
    function getFormatters() {
        const formatters = CometChatUIKit.getDataSource().getAllTextFormatters({});
        if (searchKeyword) {
            formatters.push(new CometChatTextHighlightFormatter(searchKeyword));
        }
        return formatters;
    }
    return (_jsxs("div", { className: "cometchat-threaded-message", children: [_jsx("div", { className: "cometchat-threaded-message-header", children: _jsx(CometChatThreadHeader, { onSubtitleClicked: onSubtitleClicked, parentMessage: message, onClose: onClose, hideReceipts: (chatFeatures && !chatFeatures?.coreMessagingExperience?.messageDeliveryAndReadReceipts) ??
                        CometChatSettings.chatFeatures.coreMessagingExperience.messageDeliveryAndReadReceipts }) }), requestBuilderState?.parentMessageId === message.getId() && (_jsxs(_Fragment, { children: [_jsx("div", { className: "cometchat-threaded-message-list", children: _jsx(CometChatMessageList, { textFormatters: searchKeyword && searchKeyword.trim() !== '' ? getFormatters() : undefined, goToMessageId: goToMessageId, parentMessageId: message.getId(), user: selectedItem?.getConversationType?.() === 'user'
                                ? selectedItem?.getConversationWith()
                                : selectedItem.getUid?.()
                                    ? selectedItem
                                    : undefined, group: selectedItem?.getConversationType?.() === 'group'
                                ? selectedItem?.getConversationWith()
                                : selectedItem.getGuid?.()
                                    ? selectedItem
                                    : undefined, messagesRequestBuilder: requestBuilderState, hideReplyInThreadOption: (chatFeatures && !chatFeatures?.coreMessagingExperience?.threadConversationAndReplies) ??
                                !CometChatSettings.chatFeatures.coreMessagingExperience.threadConversationAndReplies, hideTranslateMessageOption: (chatFeatures && !chatFeatures?.deeperUserEngagement?.messageTranslation) ??
                                !CometChatSettings.chatFeatures.deeperUserEngagement.messageTranslation, hideEditMessageOption: (chatFeatures && !chatFeatures?.coreMessagingExperience?.editMessage) ??
                                !CometChatSettings.chatFeatures.coreMessagingExperience.editMessage, hideDeleteMessageOption: (chatFeatures && !chatFeatures?.coreMessagingExperience?.deleteMessage) ??
                                !CometChatSettings.chatFeatures.coreMessagingExperience.deleteMessage, hideReactionOption: (chatFeatures && !chatFeatures?.deeperUserEngagement?.reactions) ??
                                !CometChatSettings.chatFeatures.deeperUserEngagement.reactions, hideMessagePrivatelyOption: (chatFeatures && !chatFeatures?.privateMessagingWithinGroups?.sendPrivateMessageToGroupMembers) ??
                                !CometChatSettings.chatFeatures.privateMessagingWithinGroups.sendPrivateMessageToGroupMembers, hideReceipts: (chatFeatures && !chatFeatures?.coreMessagingExperience?.messageDeliveryAndReadReceipts) ??
                                !CometChatSettings.chatFeatures.coreMessagingExperience.messageDeliveryAndReadReceipts, hideMessageInfoOption: (chatFeatures && !chatFeatures?.coreMessagingExperience?.messageDeliveryAndReadReceipts) ??
                                !CometChatSettings.chatFeatures.coreMessagingExperience.messageDeliveryAndReadReceipts, hideModerationView: chatFeatures?.coreMessagingExperience?.moderation === false ? true : false, hideReplyOption: chatFeatures?.coreMessagingExperience?.quotedReplies === undefined
                                ? true
                                : !chatFeatures?.coreMessagingExperience?.quotedReplies }, "threaded-message-list-content") }, "threaded-message-list-wrapper"), showComposer ? (_jsx("div", { className: "cometchat-threaded-message-composer", children: _jsx(CometChatMessageComposer, { parentMessageId: message.getId(), mentionsUsersRequestBuilder: mentionsUsersRequestBuilder, user: selectedItem?.getConversationType?.() === 'user'
                                ? selectedItem?.getConversationWith()
                                : selectedItem.getUid?.()
                                    ? selectedItem
                                    : undefined, group: selectedItem?.getConversationType?.() === 'group'
                                ? selectedItem?.getConversationWith()
                                : selectedItem.getGuid?.()
                                    ? selectedItem
                                    : undefined, disableMentions: (chatFeatures && !chatFeatures?.deeperUserEngagement?.mentions) ??
                                !CometChatSettings.chatFeatures.deeperUserEngagement.mentions, disableTypingEvents: (chatFeatures && !chatFeatures?.coreMessagingExperience?.typingIndicator) ??
                                !CometChatSettings.chatFeatures.coreMessagingExperience.typingIndicator, hidePollsOption: (chatFeatures && !chatFeatures?.deeperUserEngagement?.polls) ??
                                !CometChatSettings.chatFeatures.deeperUserEngagement.polls, hideCollaborativeDocumentOption: (chatFeatures && !chatFeatures?.deeperUserEngagement?.collaborativeDocument) ??
                                !CometChatSettings.chatFeatures.deeperUserEngagement.collaborativeDocument, hideStickersButton: (chatFeatures && !chatFeatures?.deeperUserEngagement?.stickers) ??
                                !CometChatSettings.chatFeatures.deeperUserEngagement.stickers, hideEmojiKeyboardButton: (chatFeatures && !chatFeatures?.deeperUserEngagement?.emojis) ??
                                !CometChatSettings.chatFeatures.deeperUserEngagement.emojis, hideVoiceRecordingButton: (chatFeatures && !chatFeatures?.deeperUserEngagement?.voiceNotes) ??
                                !CometChatSettings.chatFeatures.deeperUserEngagement.voiceNotes, hideCollaborativeWhiteboardOption: (chatFeatures && !chatFeatures?.deeperUserEngagement?.collaborativeWhiteboard) ??
                                !CometChatSettings.chatFeatures.deeperUserEngagement.collaborativeWhiteboard, hideVideoAttachmentOption: (chatFeatures && !chatFeatures?.coreMessagingExperience?.videoSharing) ??
                                !CometChatSettings.chatFeatures.coreMessagingExperience.videoSharing, hideFileAttachmentOption: (chatFeatures && !chatFeatures?.coreMessagingExperience?.fileSharing) ??
                                !CometChatSettings.chatFeatures.coreMessagingExperience.fileSharing, hideAudioAttachmentOption: (chatFeatures && !chatFeatures?.coreMessagingExperience?.audioSharing) ??
                                !CometChatSettings.chatFeatures.coreMessagingExperience.audioSharing, hideImageAttachmentOption: (chatFeatures && !chatFeatures?.coreMessagingExperience?.photosSharing) ??
                                !CometChatSettings.chatFeatures.coreMessagingExperience.photosSharing }) })) : (_jsx("div", { className: "message-composer-blocked", onClick: () => {
                            let user = null;
                            if (selectedItem instanceof CometChat.User) {
                                user = selectedItem;
                            }
                            else if (selectedItem instanceof CometChat.Conversation &&
                                selectedItem.getConversationType() === CometChat.RECEIVER_TYPE.USER &&
                                selectedItem.getConversationWith() instanceof CometChat.User) {
                                user = selectedItem.getConversationWith();
                            }
                            if (user) {
                                CometChat.unblockUsers([user.getUid()]).then(() => {
                                    user?.setBlockedByMe(false);
                                    CometChatUserEvents.ccUserUnblocked.next(user);
                                });
                            }
                        }, children: _jsxs("div", { className: "message-composer-blocked__text", children: [getLocalizedString('cannot_send_to_blocked_user'), ' ', _jsxs("span", { className: "message-composer-blocked__text-unblock", children: [' ', getLocalizedString('click_to_unblock')] })] }) }))] }))] }));
};
