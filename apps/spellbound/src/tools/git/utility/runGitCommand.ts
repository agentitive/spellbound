import { exec } from "child_process"
import * as vscode from "vscode"

export async function runGitCommand(
  args: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const cwd = vscode.workspace.workspaceFolders?.[0].uri.fsPath
    // Execute the npm command in the provided working directory
    exec(`git ${args}`, { cwd }, (error, stdout, stderr) => {
      if (error) {
        const errorMessage = `ERROR: Failed to run git command: ${args}\n${stdout}\n${stderr}`
        console.error(errorMessage)
        resolve(errorMessage)
      } else {
        const successMessage = `Successfully ran git command: ${args}\n${stdout}`
        resolve(successMessage)
      }
    })
  })
}
