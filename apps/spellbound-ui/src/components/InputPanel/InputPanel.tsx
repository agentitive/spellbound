import { useState } from "react";
import AutosizeTextArea from "react-autosize-textarea";

import styles from "./styles.module.scss"

import { rpc } from "../../utilities/rpc";
import useStore from "../../store";

export function InputPanel() {
  const { addMessage, messages, isThinking, setIsThinking } = useStore(state => ({
    addMessage: state.addMessage,
    messages: state.messages,
    isThinking: state.isThinking,
    setIsThinking: state.setIsThinking,
  }))
  const [input, setInput] = useState("");

  const onClick = async () => {
    const prompt = input.trim()
    if (prompt) {
      const newMessage = { role: "user", content: prompt }
      addMessage(newMessage)
      const newMessages = [...messages, newMessage]
      console.log("submitting new messages...")
      await rpc.submit(newMessages)
      setInput("")
    }
  }

  const onAbort = async () => {
    await rpc.abort()
    setIsThinking(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onClick()
    }
  }

  const saveToFile = async () => {
    await rpc.saveToFile(messages)
  }

  return (
    <div className={styles.inputPanel}>
      <AutosizeTextArea
        value={input}
        disabled={isThinking}
        placeholder="Message (Enter to send)"
        onKeyDown={onKeyDown}
        onChange={(e: React.FormEvent<HTMLTextAreaElement>) => setInput(e.currentTarget.value)}
      />
      <button
        className={styles.send}
        onClick={onClick}
        disabled={isThinking}
      >Send</button>
      {isThinking && <button
            className={styles.abort}
            onClick={onAbort}>
        Abort
      </button>}
      {!isThinking && <button
        className={styles.export}
        onClick={saveToFile}
        disabled={isThinking}
      >Export</button>}
    </div>
  );
}
