import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useState } from 'react';
import '../../styles/CometChatCreateGroup/CometChatCreateGroup.css';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { AppContext } from '../../context/AppContext';
import { CometChatGroupEvents, getLocalizedString } from '@cometchat/chat-uikit-react';
const CometChatCreateGroup = ({ setShowCreateGroup, onGroupCreated = () => { } }) => {
    const [groupType, setGroupType] = useState('public');
    const [groupName, setGroupName] = useState('');
    const [isGroupCreated, setIsGroupCreated] = useState(false);
    const [groupPassword, setGroupPassword] = useState('');
    const { setAppState } = useContext(AppContext);
    async function handleSubmit() {
        if (!isGroupCreated) {
            setIsGroupCreated(true);
            const GUID = `group_${new Date().getTime()}`;
            const group = new CometChat.Group(GUID, groupName, groupType, groupPassword);
            try {
                const createdGroup = await CometChat.createGroup(group);
                CometChatGroupEvents.ccGroupCreated.next(createdGroup);
                onGroupCreated(createdGroup);
                setAppState({ type: 'updateSelectedItemGroup', payload: createdGroup });
                setAppState({ type: 'updateSideComponent', payload: { visible: false, type: '' } });
                setShowCreateGroup(false);
            }
            catch (error) {
                console.error('Group creation failed with exception:', error);
            }
        }
    }
    return (_jsx("div", { className: "cometchat-create-group__backdrop", children: _jsxs("div", { className: "cometchat-create-group", children: [_jsx("div", { className: "cometchat-create-group__title", children: getLocalizedString('new_group') }), _jsxs("div", { className: "cometchat-create-group__content", children: [_jsxs("div", { className: "cometchat-create-group__type-wrapper", children: [_jsx("span", { className: "cometchat-create-group__type-text", children: getLocalizedString('type') }), _jsxs("div", { className: "cometchat-create-group__type-content", children: [_jsx("div", { className: `cometchat-create-group__type ${groupType === 'public' ? 'cometchat-create-group__type-selected' : ''}`, onClick: () => setGroupType('public'), children: getLocalizedString('create_group_public') }), _jsx("div", { className: `cometchat-create-group__type ${groupType === 'private' ? 'cometchat-create-group__type-selected' : ''}`, onClick: () => setGroupType('private'), children: getLocalizedString('create_group_private') }), _jsx("div", { className: `cometchat-create-group__type ${groupType === 'password' ? 'cometchat-create-group__type-selected' : ''}`, onClick: () => setGroupType('password'), children: getLocalizedString('create_group_password') })] })] }), _jsxs("div", { className: "cometchat-create-group__name-wrapper", children: [getLocalizedString('name'), _jsx("input", { type: "text", className: "cometchat-create-group__input", placeholder: getLocalizedString('create_group_name_placeholder'), value: groupName, onChange: (e) => setGroupName(e.target.value), required: true })] }), groupType === 'password' && (_jsxs("div", { className: "cometchat-create-group__password-wrapper", children: [getLocalizedString('create_group_password'), _jsx("input", { type: "password", className: "cometchat-create-group__input", placeholder: getLocalizedString('create_group_password_placeholder'), value: groupPassword, onChange: (e) => setGroupPassword(e.target.value), required: true })] }))] }), _jsx("button", { className: "cometchat-create-group__submit-button", onClick: handleSubmit, children: getLocalizedString('create_group') }), _jsx("div", { className: "cometchat-create-group__close-button", onClick: () => setShowCreateGroup(false) })] }) }));
};
export default CometChatCreateGroup;
