import { promises as fs, mkdirSync, existsSync } from "fs"
import path from "path"
import * as vscode from "vscode"
import { WriteToolInterface } from "./WriteToolInterface"

export async function writeToolImpl(
  params: WriteToolInterface
): Promise<string> {
  const filePath = params.path
  const contents = params.contents

  // Base off of workspace directory
  const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  if (!workspacePath) {
    return `ERROR: No workspace folder open`
  }

  const absoluteFilePath = path.join(workspacePath, filePath)
  const fileDirectory = path.dirname(absoluteFilePath)

  if (!existsSync(fileDirectory)) {
    mkdirSync(fileDirectory, { recursive: true })
  }

  try {
    await fs.writeFile(absoluteFilePath, contents, "utf8")
    return `File written to ${filePath}`
  } catch (err) {
    return `ERROR: Failed to write file: ${filePath}`
  }
}
