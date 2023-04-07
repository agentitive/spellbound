import { Message } from "../types"


export type ExtensionProcedures = {
    abort(): Promise<void>,
    submit(messages: Message[]): Promise<void>,
    saveToFile(messages: Message[]): Promise<void>,
}
