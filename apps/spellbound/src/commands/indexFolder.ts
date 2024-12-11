import * as vscode from "vscode"
import { clearNamespace, upsertFolder } from "../api/pinecone"

// path is vscode Path thing
export const indexFolder = async (
  path: vscode.Uri,
  _: any,
  namespace: string = ""
) => {
  try {
    // if namespace is empty, prompt the user
    if (namespace === "") {
      namespace =
        (await vscode.window.showInputBox({
          prompt: "Enter a namespace for this index",
          placeHolder: "namespace",
        })) || ""
    }

    await clearNamespace()
    vscode.window.showInformationMessage(`Indexing ${namespace}...`)

    await upsertFolder(path.path, 4000, 100, {}, namespace)
    vscode.window.showInformationMessage("Workspace indexed!")
  } catch (error) {
    console.error(error)
    vscode.window.showErrorMessage("Error indexing workspace")
    if (error instanceof Error) {
      vscode.window.showErrorMessage(error.message)
    }
  }
}
