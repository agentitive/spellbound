import * as vscode from "vscode"
import { runNpmCommand } from "./utility/runNpmCommand"

export async function npmToolImpl(script: string): Promise<string> {
  // Base off of workspace directory
  const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  if (!workspacePath) {
    throw new Error("No workspace folder found.")
  }

  // Use the helper function to run the npm script
  return await runNpmCommand(script, workspacePath)
}
