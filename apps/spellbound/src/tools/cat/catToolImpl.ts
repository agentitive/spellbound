import { promises as fs } from "fs"
import path from "path"
import * as vscode from "vscode"
import { CatToolInterface } from "./CatToolInterface"

export async function catToolImpl(params: CatToolInterface): Promise<string> {
  const relativeFilePath = params.path

  const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  if (!workspacePath) {
    return `ERROR: No workspace folder currently open`
  }

  const absoluteFilePath = path.join(workspacePath, relativeFilePath)

  try {
    const contents = await fs.readFile(absoluteFilePath, "utf8")
    return contents
  } catch (err) {
    return `ERROR: Failed to read file: ${relativeFilePath}`
  }
}
