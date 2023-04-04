import * as vscode from "vscode"
import { getModelList } from "./getModelList"

let availableModels: string[] = []

export async function getCurrentModel() {
  const spellboundConfig = vscode.workspace.getConfiguration("spellbound")

  const model = spellboundConfig.get<string>("model") || "gpt-4"

  let updatedListOnThisCheck: boolean = false

  // Refresh the list of available models if it's empty
  if (availableModels.length === 0) {
    availableModels = await getModelList()
    updatedListOnThisCheck = true
  }

  // Check if the model is available
  if (!availableModels.includes(model)) {
    if (!updatedListOnThisCheck) {
      availableModels = await getModelList()
    }

    // If model is not available even after refreshing the list, warn the user
    if (!availableModels.includes(model)) {
      vscode.window.showWarningMessage(
        `Model '${model}' not found. Available models: ${availableModels.join(
          ", "
        )}\n\nPlease set the 'spellbound.model' setting to one of the available models.`
      )
      return
    }
  }

  return model
}
