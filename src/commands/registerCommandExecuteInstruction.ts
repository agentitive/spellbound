import * as vscode from "vscode"
import { streamInference } from "../api/openai"
import { getModelList } from "../environment/getModelList"

export async function registerCommandExecuteInstruction() {
  let availableModels = await getModelList()

  return vscode.commands.registerCommand(
    "spellbound.executeInstruction",
    async () => {
      // Get the user's instruction
      const instruction = await vscode.window.showInputBox({
        placeHolder: "Enter your instruction for Spellbound",
      })

      if (!instruction) {
        return
      }

      // Call GPT API to generate code based on the user's instruction
      const generatedCode = await streamInference(
        [{ role: "system", content: instruction }],
        {
          onData: (chunk) => {
            console.log(chunk)
          },
        }
      )

      if (!generatedCode) {
        vscode.window.showWarningMessage(
          "No code generated from the input instruction"
        )
        return
      }

      // Get the active text editor
      const activeEditor = vscode.window.activeTextEditor

      if (!activeEditor) {
        vscode.window.showWarningMessage(
          "No active text editor found to insert the generated code"
        )
        return
      }

      // Insert the generated code at the current cursor position
      const currentPosition = activeEditor.selection.active
      activeEditor.edit((editBuilder) => {
        editBuilder.insert(currentPosition, generatedCode)
      })
    }
  )
}
