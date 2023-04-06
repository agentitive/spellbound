import { GitToolInterface } from "./GitToolInterface"
import * as vscode from "vscode"
import { execSync } from "child_process"
import { runGitCommand } from "./utility/runGitCommand"

export async function gitToolImpl(params: GitToolInterface): Promise<string> {
  const { args } = params

  const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  if (!workspacePath) {
    return `ERROR: No workspace folder currently open`
  }

  try {
    return await runGitCommand(args)
  } catch (err: any) {
    return `ERROR: Failed to execute git command: ${err?.message || 'Unknown error'}`
  }
}
