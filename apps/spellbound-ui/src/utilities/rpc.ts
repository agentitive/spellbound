import { useEffect } from "react";

import { vscode } from "./vscode";
import useStore from "../store";

import { MessagePipe, Server, makeClientRouter, makeClient, ServerRouter } from "spellbound-shared";

console.log(`Creating TRPC server client...`);
const clientPipe = new MessagePipe(
    async (message) => vscode.postMessage(message)
)
export const client = makeClient<ServerRouter>(clientPipe)

export const useRpc = () => {
    const { setIsThinking, messages, addMessage, updateMessage } =

        useStore(state => ({
            isThinking: state.isThinking,
            setIsThinking: state.setIsThinking,
            messages: state.messages,
            addMessage: state.addMessage,
            updateMessage: state.updateMessage
        }));

    useEffect(() => {
        const clientRouter = makeClientRouter({
            startMessage: async () => {
                setIsThinking(true);
                addMessage({
                    role: 'assistant',
                    content: ''
                });
            },
            updateMessage: async (content) => {
                const lastMessage = messages[messages.length - 1];
                const oldContent = lastMessage.content;
                updateMessage(messages.length - 1, oldContent + content)
            },
            finishMessage: async () => {
                setIsThinking(false);
            },
            toolResult: async (content) => {
                addMessage({
                    role: 'system',
                    content
                })
            },
        })

        const serverPipe = new MessagePipe(
            async (message) => vscode.postMessage(message),
        )

        const server = new Server(serverPipe, {
            router: clientRouter,
        })

        const onMessage = (message: any) => {
            serverPipe.receive(message.data)
            clientPipe.receive(message.data)

        }
        window.addEventListener('message', onMessage);

        return () => {
            window.removeEventListener('message', onMessage);
        }
    }, [messages]);

}
