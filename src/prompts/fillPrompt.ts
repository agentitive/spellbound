import * as vscode from "vscode"
import ejs from "ejs"
import { promises as fs } from "fs"
import path from "path"

type FillPromptParams = {
  codebase_description?: string | undefined
  language?: string | undefined
  task: string
  current_file_name?: string | undefined
  langcode?: string | undefined
  current_file_contents?: string | undefined
}

export async function fillPrompt(params: FillPromptParams): Promise<string> {
  const activeTextEditor = vscode.window.activeTextEditor

  // Getting language, current_file_name, langcode, and current_file_contents from the active text editor
  if (activeTextEditor) {
    params.language = activeTextEditor.document.languageId
    params.current_file_name = path.basename(activeTextEditor.document.fileName)
    params.langcode = activeTextEditor.document.languageId // Assuming langcode is same as languageId
    params.current_file_contents = activeTextEditor.document.getText()
  }

  params.language = params.language || "undefined"
  params.current_file_name = params.current_file_name || "undefined"
  params.langcode = params.langcode || "undefined"
  params.current_file_contents = params.current_file_contents || "undefined"

  // Get the workspace folder path
  const wsFolders = vscode.workspace.workspaceFolders
  if (wsFolders && wsFolders.length > 0) {
    // Assume that the first workspace folder is the root of the codebase
    const workspaceFolderPath = wsFolders[0].uri.fsPath

    // Load codebase_description from the .spellbound/description.md file
    const descriptionFilePath = path.join(
      workspaceFolderPath,
      ".spellbound",
      "description.md"
    )

    try {
      params.codebase_description = await fs.readFile(
        descriptionFilePath,
        "utf-8"
      )
    } catch (error) {
      vscode.window.showWarningMessage(
        "Could not find a .spellbound/description.md file in the workspace folder. Presence of this file improves AI performance."
      )

      params.codebase_description = undefined
    }
  }

  // Read file
  const promptFilePath = path.join(__dirname, "..", "assets", "prompt.md")
  const sourcePrompt = await fs.readFile(promptFilePath, "utf-8")

  // Fill out the prompt
  const filledPrompt = ejs.render(sourcePrompt, params)

  return filledPrompt
}
