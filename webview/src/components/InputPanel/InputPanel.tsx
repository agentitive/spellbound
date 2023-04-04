import { useState } from "react";

import styles from "./styles.module.scss"
import { vscode } from "../../utilities/vscode";
import useStore from "../../store";

export function InputPanel() {
  const { messages } = useStore(state => ({ messages: state.messages }))
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

  return (
    <div className={styles.inputPanel}>
      <input
        type="text"
        value={input}
        placeholder="Message (Enter to send)"
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={onClick}>Send</button>
    </div>
  );
}