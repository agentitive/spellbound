import * as vscode from "vscode"
import { listModels, streamingCompletion } from "./openai"

export function getOpenAIKey() {
  const openai_api_key =
    vscode.workspace
      .getConfiguration("spellbound")
      .get<string>("openai_api_key") || process.env.OPENAI_API_KEY

  if (!openai_api_key) {
    vscode.window.showWarningMessage(
      "No OpenAI API key found. Please set the 'spellbound.openai_api_key' setting or set the OPENAI_API_KEY environment variable."
    )
  }

  return openai_api_key
}

export function getPineconeKey() {
  const pinecone_api_key =
    vscode.workspace
      .getConfiguration("spellbound")
      .get<string>("pinecone_api_key") || process.env.PINECONE_API_KEY

  if (!pinecone_api_key) {
    vscode.window.showWarningMessage(
      "No Pinecone API key found. Please set the 'spellbound.pinecone_api_key' setting or set the PINECONE_API_KEY environment variable."
    )
  }

  return pinecone_api_key
}

async function getModelList() {
  const key = getOpenAIKey()

  if (key) {
    const models = await listModels(key)

    return models
  }

  return []
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('Your extension "spellbound" is now active!')

  let availableModels = await getModelList()

  const executeInstruction = vscode.commands.registerCommand(
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

  context.subscriptions.push(executeInstruction)
}

// This method is called when your extension is deactivated
export function deactivate() {}
