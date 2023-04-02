import * as vscode from "vscode"
import { streamingCompletion } from "../api/openai"
import { getOpenAIKey } from "../environment/getOpenAIKey"
import { getModelList } from "../environment/getModelList"

export async function registerCommandExecuteInstruction() {
  let availableModels = await getModelList()

  return vscode.commands.registerCommand(
    "spellbound.executeInstruction",
    async () => {
      // Get the extension's configuration
      const spellboundConfig = vscode.workspace.getConfiguration("spellbound")

      // Get the 'model' setting value
      const model = spellboundConfig.get<string>("model") || "gpt-4"

      // Refresh the list of available models if it's empty
      if (availableModels.length === 0) {
        availableModels = await getModelList()
      }

      // Check if the model is available
      if (!availableModels.includes(model)) {
        vscode.window.showWarningMessage(
          `Model '${model}' not found. Available models: ${availableModels.join(
            ", "
          )}\n\nPlease set the 'spellbound.model' setting to one of the available models.`
        )
        return
      }

      const openai_api_key = getOpenAIKey()

      if (!openai_api_key) {
        return
      }

      // Get the user's instruction
      const instruction = await vscode.window.showInputBox({
        placeHolder: "Enter your instruction for Spellbound",
      })

      if (!instruction) {
        return
      }

      // Call GPT API to generate code based on the user's instruction
      const generatedCode = await streamingCompletion(
        openai_api_key,
        model,
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
