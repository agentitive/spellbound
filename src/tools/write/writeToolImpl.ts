import { promises as fs } from "fs"
import path from "path"
import * as vscode from "vscode"

export async function writeToolImpl(
  filePath: string,
  contents: string
): Promise<string> {
  // Base off of workspace directory
  const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  if (!workspacePath) {
    return `ERROR: No workspace folder currently open`
  }

  try {
    const absoluteFilePath = path.join(workspacePath, filePath)

    await fs.writeFile(absoluteFilePath, contents, "utf8")

    return `File written to ${filePath}`
  } catch (err) {
    return `ERROR: Failed to write file: ${filePath}`
  }
}
