import { useState } from "react";

import styles from "./styles.module.scss"
import { vscode } from "../../utilities/vscode";
import useStore from "../../store";

export function InputPanel() {
  const { messages, isThinking } = useStore(state => ({ 
    messages: state.messages,
    isThinking: state.isThinking
  }))
  const [input, setInput] = useState("");

  const onClick = () => {
    const prompt = input.trim()
    if (prompt) {
      // Pass the prompt to the extension
      vscode.postMessage({
        command: "sendPrompt",
        messages: [...messages, { role: "system", content: prompt }],
      })
      
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
      <input
        type="text"
        value={input}
        disabled={isThinking}
        placeholder="Message (Enter to send)"
        onKeyDown={onKeyDown}
        onChange={(e) => setInput(e.target.value)}
      />
      <button 
        onClick={onClick}
        disabled={isThinking}
      >Send</button>
    </div>
  );
}