import { promises as fs } from "fs"
import path from "path"
import * as vscode from "vscode"
import { MoveToolInterface } from "./MoveToolInterface"

export async function moveToolImpl(params: MoveToolInterface): Promise<string> {
  const sourcePath = params.source
  const destPath = params.dest

  const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  if (!workspacePath) {
    return `ERROR: No workspace folder currently open`
  }
   
  const sourceAbsolutePath = path.join(workspacePath, sourcePath)
  const destinationAbsolutePath = path.join(workspacePath, destPath)

  try {
    await fs.rename(sourceAbsolutePath, destinationAbsolutePath)
    return `File moved from ${sourcePath} to ${destPath}`
  } catch (err) {
    return `ERROR: Failed to move file from ${sourcePath} to ${destPath}`
  }
}
