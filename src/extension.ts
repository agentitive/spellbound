import * as vscode from "vscode"
import { ChatboxViewProvider } from "./views/ChatboxViewProvider"
import { registerCommandExecuteInstruction } from "./commands/registerCommandExecuteInstruction"

export async function activate(context: vscode.ExtensionContext) {
  console.log('Your extension "spellbound" is now active!')

  const chatboxViewProvider = new ChatboxViewProvider(context.extensionUri)

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "spellbound.chat",
      chatboxViewProvider
    )
  )

  const executeInstruction = await registerCommandExecuteInstruction()

  context.subscriptions.push(executeInstruction)
}

// This method is called when your extension is deactivated
export function deactivate() {}
