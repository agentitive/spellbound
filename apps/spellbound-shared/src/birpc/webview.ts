import { BirpcOptions, createBirpc } from "./createBirpc";
import { ExtensionProcedures } from "./extension";


export type WebviewProcedures = {
    start(): Promise<void>,
    update(message: string): Promise<void>,
    finish(): Promise<void>,
    result(message: string): Promise<void>,
}


export const makeWebviewRpc = 
    (link: BirpcOptions<ExtensionProcedures>, api: WebviewProcedures) => {
        return createBirpc<ExtensionProcedures>(api, link);
    }