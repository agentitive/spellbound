import { exec } from "child_process"
import * as vscode from "vscode"

export async function runNpmCommand(
  args: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Execute the npm command in the provided working directory
    exec(`npm ${args}`, {
      // workspace root
      cwd: vscode.workspace.workspaceFolders?.[0].uri.fsPath,
    }, (error, stdout, stderr) => {
      if (error) {
        const errorMessage = `ERROR: Failed to run npm command: ${args}\n${stdout}\n${stderr}`
        console.error(errorMessage)
        resolve(errorMessage)
      } else {
        const successMessage = `Successfully ran npm command: ${args}\n${stdout}\n${stderr}`
        resolve(successMessage)
      }
    })
  })
}
