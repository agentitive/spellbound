import * as vscode from "vscode"
import { runNpmCommand } from "./utility/runNpmCommand"
import { NpmToolInterface } from "./NpmToolInterface"

export async function npmToolImpl(params: NpmToolInterface): Promise<string> {
  const { script } = params

  // Base off of workspace directory
  const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  if (!workspacePath) {
    throw new Error("No workspace folder found.")
  }

  // Use the helper function to run the npm script
  return await runNpmCommand(script, workspacePath)
}
