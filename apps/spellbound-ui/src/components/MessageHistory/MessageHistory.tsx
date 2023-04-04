import useStore from "../../store"
import { MessageItem } from "../MessageItem"

import styles from "./styles.module.scss"


export const MessageHistory = () => {
    const { messages } = useStore(state => ({ messages: state.messages }))

    return <div className={styles.messageHistory}>
        {messages.map((message, index) => (
            <MessageItem key={index} message={message} />
        ))}
    </div>
}