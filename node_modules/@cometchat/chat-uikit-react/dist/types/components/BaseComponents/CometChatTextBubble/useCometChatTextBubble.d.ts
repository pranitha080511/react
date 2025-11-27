import { CometChatTextFormatter } from "../../../formatters/CometChatFormatters/CometChatTextFormatter";
export declare const useCometChatTextBubble: (props: {
    textFormatters: Array<CometChatTextFormatter>;
}) => {
    pasteHtml: (textElement: HTMLElement, text: string) => void;
};
