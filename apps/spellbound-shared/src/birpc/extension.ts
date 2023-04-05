import { Message } from "../types"


export type ExtensionProcedures = {
    submit(messages: Message[]): Promise<void>
}