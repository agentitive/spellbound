import * as vscode from "vscode"

export function getCurrentWorkspaceFolder() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  if (!workspaceFolder) {
    vscode.window.showWarningMessage("No workspace folder open")
    throw new Error("No workspace folder open")
  }

  return workspaceFolder
}
