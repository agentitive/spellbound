import { createBirpc } from "./createBirpc";
import { Message } from "../types"
import { Webview } from "vscode";
import { WebviewProcedures } from "./webview";


export type ExtensionProcedures = {
    submit(messages: Message[]): Promise<void>
}

export const makeExtensionRpc = (webview: Webview, procs: ExtensionProcedures) => createBirpc<WebviewProcedures>(
    procs,
    {
        post: data => { 
            webview.postMessage(data) 
        },
        on: data => { 
            webview.onDidReceiveMessage((e: any) => {
                data(e)
            }) 
        }
    }
);