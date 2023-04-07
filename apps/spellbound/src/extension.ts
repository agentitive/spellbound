import * as vscode from "vscode"
import { ChatboxViewProvider } from "./views/ChatboxViewProvider"
import { indexWorkspace } from "./commands/indexWorkspace"
import { indexFolder } from "./commands/indexFolder"

export async function activate(context: vscode.ExtensionContext) {
  console.log('Your extension "spellbound" is now active!')

  const chatboxViewProvider = new ChatboxViewProvider(context.extensionUri)

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "spellbound.chat",
      chatboxViewProvider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      }
    )
  )

  // register command
  context.subscriptions.push(
    vscode.commands.registerCommand("spellbound.indexWorkspace", indexWorkspace)
  )
  context.subscriptions.push(
    vscode.commands.registerCommand("spellbound.indexFolder", indexFolder)
  )
}

// This method is called when your extension is deactivated
export function deactivate() {}
