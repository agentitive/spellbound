import { useEffect } from "react";
import useStore from "../store";
import { vscode } from "./vscode";

export const useRpc = () => {
    const { messages, addMessage, updateMessage } =

        useStore(state => ({
            messages: state.messages,
            addMessage: state.addMessage,
            updateMessage: state.updateMessage
        }));

    const handleMessage = (event: MessageEvent) => {
        const message = event.data; // The JSON data our extension sent
        switch (message.command) {
            case 'sendMessage':
                switch (message.message.type) {
                    case 'start':
                        addMessage({
                            role: 'assistant',
                            content: ''
                        });
                        break;
                    case 'chunk':
                        const lastMessage = messages[messages.length - 1];
                        const oldContent = lastMessage.content;
                        const newContent = message.message.content;
                        updateMessage(messages.length - 1, oldContent + newContent)
                        break;
                    case 'done':
                        // Todo: re-enable the input area
                        break;
                    case 'input':
                        addMessage({
                            role: 'user',
                            content: message.message.content

                        });
                        break;
                    case 'tool-result':
                        vscode.postMessage({
                            command: "sendPrompt",
                            messages: [...messages, { role: "system", content: message.message.content }]
                        })
                        break;
                }
                break;
        }
    }

    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [messages]);

}
