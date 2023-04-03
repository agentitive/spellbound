import { promises as fs } from "fs"
import path from "path"
import * as vscode from "vscode"

export async function catToolImpl(relativeFilePath: string): Promise<string> {
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
