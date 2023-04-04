import { FC } from "react"

import ReactMarkdown from 'react-markdown'

import styles from "./styles.module.scss"
import { Message } from "spellbound-shared"


export type MessageItemProps = {
    message: Message
}

const styleForRole = (role: string) => {
    switch (role) {
        case "user":
            return styles.user
        case "assistant":
            return styles.assistant
        case "system":
            return styles.system
    }
}


export const MessageItem: FC<MessageItemProps> = ({ message }) => {
    return <div className={`${styles.messageItem} ${styleForRole(message.role)}`}>
        {/* <div className={styles.role}>{message.role}</div> */}
        <div className={styles.content}>
            <ReactMarkdown children={message.content} />
        </div>
    </div>
}