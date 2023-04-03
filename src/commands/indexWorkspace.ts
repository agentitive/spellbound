import * as vscode from "vscode"
import { clearNamespace, upsertFolder } from "../api/pinecone"
import { makeAbsolute } from "../utils/paths"


export const indexWorkspace = async () => {
    try {
        await clearNamespace("code")
        vscode.window.showInformationMessage("Indexing workspace...")

        await upsertFolder(
            makeAbsolute("src"),
            100,
            10,
            {},
            "code"
        )
        vscode.window.showInformationMessage("Workspace indexed!")
    } catch (error) {
        console.error(error)
        vscode.window.showErrorMessage("Error indexing workspace")
        if (error instanceof Error) {
            vscode.window.showErrorMessage(error.message)
        }
    }
}