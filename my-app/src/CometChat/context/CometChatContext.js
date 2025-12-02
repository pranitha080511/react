import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext, useEffect } from 'react';
import { CometChatSettings } from '../CometChatSettings';
const CometChatContext = createContext(undefined);
const defaultAgentFeatures = {
    chatHistory: true,
    newChat: true,
    agentIcon: '',
    showAgentIcon: true,
};
export const CometChatProvider = ({ children, authBuilderSetting }) => {
    const [chatFeatures, setChatFeatures] = useState(CometChatSettings.chatFeatures);
    const [callFeatures, setCallFeatures] = useState(CometChatSettings.callFeatures);
    const [styleFeatures, setStyleFeatures] = useState(CometChatSettings.style);
    const [layoutFeatures, setLayoutFeatures] = useState(CometChatSettings.layout);
    const [noCodeFeatures, setNoCodeFeatures] = useState(CometChatSettings.noCode);
    const [aiAgentFeatures, setAiAgentFeatures] = useState(CometChatSettings?.agent ?? defaultAgentFeatures);
    useEffect(() => {
        if (authBuilderSetting) {
            const { chatFeatures, callFeatures, layout, style, noCode, agent } = authBuilderSetting;
            setChatFeatures(chatFeatures);
            setCallFeatures(callFeatures);
            setStyleFeatures(style);
            setLayoutFeatures(layout);
            setNoCodeFeatures(noCode || CometChatSettings?.noCode);
            setAiAgentFeatures(agent);
        }
    }, [authBuilderSetting]);
    return (_jsx(CometChatContext.Provider, { value: {
            chatFeatures,
            callFeatures,
            styleFeatures,
            layoutFeatures,
            noCodeFeatures,
            aiAgentFeatures,
            setChatFeatures,
            setCallFeatures,
            setStyleFeatures,
            setLayoutFeatures,
            setNoCodeFeatures,
            setAiAgentFeatures,
        }, children: children }));
};
export const useCometChatContext = () => {
    const context = useContext(CometChatContext);
    if (!context)
        throw new Error('useCometChatContext must be used within a CometChatProvider');
    return context;
};
let chatBuilderName = 'cometchat-visual-builder-react';
let chatBuilderVersion = '1.0.17';
(async () => {
    try {
        const pkg = await import('../../../package.json');
        chatBuilderName = pkg?.default?.cometChatCustomConfig.name ?? chatBuilderName;
        chatBuilderVersion = pkg?.default?.cometChatCustomConfig.version ?? chatBuilderVersion;
    }
    catch (e) {
        // fallback silently
    }
    if (typeof window !== 'undefined') {
        window.CometChatVisualBuilderReact = {
            name: chatBuilderName,
            version: chatBuilderVersion,
        };
    }
})();
