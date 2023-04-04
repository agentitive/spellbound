import { useRpc } from "../../utilities/rpc";
import { InputPanel } from "../InputPanel";
import { MessageHistory } from "../MessageHistory";
import styles from "./styles.module.scss"


export function App() {
  useRpc()
  
  return (
    <main className={styles.app}>
        <h1>Spellbound 💫</h1>
        <MessageHistory />
        <InputPanel />
    </main>
  );
}