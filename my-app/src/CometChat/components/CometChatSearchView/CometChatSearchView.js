import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CometChatButton, CometChatSearch, getLocalizedString } from '@cometchat/chat-uikit-react';
import '../../styles/CometChatSearchView/CometChatSearchView.css';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import closeIcon from '../../assets/close2x.svg';
/**
 * CometChatSearchView component renders a search interface for messages.
 *
 * @param {MessagesViewProps} props - The props for the component.
 * @returns {JSX.Element} The rendered search view.
 */
const CometChatSearchView = (props) => {
    const { user, group, onClose, onMessageClicked } = props;
    return (_jsxs("div", { className: "cometchat-search-view", children: [_jsxs("div", { className: "cometchat-search-view__header", children: [_jsx("div", { className: "cometchat-search-view__title", children: getLocalizedString('messages_search_title') }), _jsx("div", { className: "cometchat-search-view__close-button", children: _jsx(CometChatButton, { iconURL: closeIcon, onClick: onClose }) })] }), _jsx("div", { className: "cometchat-search-view__content", children: _jsx(CometChatSearch, { hideBackButton: true, uid: user?.getUid(), guid: group?.getGuid(), onBack: onClose, onMessageClicked: onMessageClicked, messagesRequestBuilder: new CometChat.MessagesRequestBuilder().setLimit(30) }) })] }));
};
export default CometChatSearchView;
