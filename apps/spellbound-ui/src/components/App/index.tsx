import { InputPanel } from "../InputPanel";
import { MessageHistory } from "../MessageHistory";
import styles from "./styles.module.scss"


export function App() {
  return (
    <main className={styles.app}>
        <h1>Spellbound 💫</h1>
        <MessageHistory />
        <InputPanel />
    </main>
  );
}