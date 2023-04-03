import * as vscode from "vscode"
import { ChatboxViewProvider } from "./views/ChatboxViewProvider"

export async function activate(context: vscode.ExtensionContext) {
  console.log('Your extension "spellbound" is now active!')

  await vscode.commands.executeCommand(
    "workbench.action.webview.openDeveloperTools"
  )

  const chatboxViewProvider = new ChatboxViewProvider(context.extensionUri)

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "spellbound.chat",
      chatboxViewProvider
    )
  )
}

// This method is called when your extension is deactivated
export function deactivate() {}
