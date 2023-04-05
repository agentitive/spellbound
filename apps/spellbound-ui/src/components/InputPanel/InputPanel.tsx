import { useState } from "react";
import AutosizeTextArea from "react-autosize-textarea";

import styles from "./styles.module.scss"

import { rpc } from "../../utilities/rpc";
import useStore from "../../store";

export function InputPanel() {
  const { addMessage, messages, isThinking } = useStore(state => ({
    addMessage: state.addMessage,
    messages: state.messages,
    isThinking: state.isThinking
  }))
  const [input, setInput] = useState("");

  const onClick = async () => {
    const prompt = input.trim()
    if (prompt) {
      const newMessage = { role: "system", content: prompt }
      addMessage(newMessage)
      const newMessages = [...messages, newMessage]
      console.log("submitting new messages...")
      await rpc.submit(newMessages)
      setInput("")
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onClick()
    }
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
        onClick={onClick}
        disabled={isThinking}
      >Send</button>
    </div>
  );
}
