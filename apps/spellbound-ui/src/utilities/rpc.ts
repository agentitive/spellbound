import { useEffect } from "react";

import { vscode } from "./vscode";
import useStore from "../store";
import { makeClient } from "./trpc";

console.log(`Creating TRPC server client...`);
export const client = makeClient()


export const useRpc = () => {
    const { isThinking, setIsThinking, messages, addMessage, updateMessage } =

        useStore(state => ({
            isThinking: state.isThinking,
            setIsThinking: state.setIsThinking,
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
                        setIsThinking(true);
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
                        setIsThinking(false);
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
