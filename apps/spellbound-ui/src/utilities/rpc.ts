import { vscode } from "./vscode";
import useStore from "../store";
import { makeWebviewRpc } from "spellbound-shared";

export const rpc = makeWebviewRpc({
    post: data => {
        vscode.postMessage(data)
    },
    on: cb => {
        window.addEventListener('message', event => {
            cb(event.data)
        })
    }
},{
    start: async () => {
        const { setIsThinking, addMessage } = useStore.getState();

        setIsThinking(true);
        addMessage({
            role: 'assistant',
            content: ''
        });
    },
    update: async (message: string) => {
        const { messages, updateMessage } = useStore.getState();
        const lastMessage = messages[messages.length - 1];
        updateMessage(messages.length - 1, lastMessage.content + message)
    },
    finish: async () => {
        const { setIsThinking } = useStore.getState();
        setIsThinking(false);
    },
    result: async (message: string) => {
        const { addMessage } = useStore.getState();
        addMessage({
            role: 'system',
            content: message
        })
    },
})
