import * as vscode from "vscode"
import ejs from "ejs"
import { promises as fs } from "fs"
import path from "path"
import { AnyToolInterface } from "../tools/AnyToolInterface"
import { ToolEngine } from "../tools/ToolEngine"

type FillPromptParams = {
  codebase_description?: string | undefined
  language?: string | undefined
  task: string
  current_file_name?: string | undefined
  langcode?: string | undefined
  current_file_contents?: string | undefined
}

// render unordered list of tools
function renderToolList(tools: Partial<typeof ToolEngine>) {
  return Object.values(tools).map(([_, sig, doc]) => {
    return `- ${sig}: ${doc}`
  })
}

export async function fillPrompt(params?: Partial<FillPromptParams>): Promise<string> {
  params = params || {}

  const activeTextEditor = vscode.window.activeTextEditor

  // Get the workspace folder path
  const basePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  // Getting language, current_file_name, langcode, and current_file_contents from the active text editor
  if (activeTextEditor) {
    params.language = activeTextEditor.document.languageId

    if (basePath) {
      params.current_file_name = path.relative(
        basePath,
        activeTextEditor.document.fileName
      )
    }

    params.langcode = activeTextEditor.document.languageId // Assuming langcode is same as languageId
    params.current_file_contents = activeTextEditor.document.getText()
  }

  params.language = params.language || "undefined"
  params.current_file_name = params.current_file_name || "undefined"
  params.langcode = params.langcode || "undefined"
  params.current_file_contents = params.current_file_contents || "undefined"
  params.codebase_description = "Unknown codebase."

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
    }
  }

  // Read file
  const promptFilePath = path.join(__dirname, "..", "assets", "prompt.md")
  const sourcePrompt = await fs.readFile(promptFilePath, "utf-8")

  // Fill out the prompt
  const filledPrompt = ejs.render(sourcePrompt, {
    ...params, 
    toolList: renderToolList(ToolEngine),
  })

  return filledPrompt
}
