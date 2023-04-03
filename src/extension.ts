import * as vscode from "vscode"
import { ChatboxViewProvider } from "./views/ChatboxViewProvider"
import { registerCommandExecuteInstruction } from "./commands/registerCommandExecuteInstruction"
import { fillPrompt } from "./prompts/fillPrompt"

export async function activate(context: vscode.ExtensionContext) {
  console.log('Your extension "spellbound" is now active!')

  await vscode.commands.executeCommand(
    "workbench.action.webview.openDeveloperTools"
  )

  const prompt = await fillPrompt({
    task: "This is a task",
  })

  console.log(prompt)

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
