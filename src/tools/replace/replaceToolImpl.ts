import { promises as fs } from "fs"
import path from "path"
import * as vscode from "vscode"

export async function replaceToolImpl(
  filePath: string,
  old: string,
  new_: string
): Promise<string> {
  // Base off of workspace directory
  const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  if (!workspacePath) {
    throw new Error("No workspace folder found.")
  }

  try {
    const absoluteFilePath = path.join(workspacePath, filePath)

    // Read the file content
    const fileContent = await fs.readFile(absoluteFilePath, "utf8")

    // Replace the old text with the new text
    const split = fileContent.split(old)

    const updatedContent = split.join(new_)

    const numberOfReplacements = split.length - 1

    // Write the updated content back to the file
    await fs.writeFile(absoluteFilePath, updatedContent, "utf8")

    if (numberOfReplacements === 0) {
      return `No instances of given string found in file: ${filePath}`
    } else if (numberOfReplacements === 1) {
      return `Successfully replaced 1 instance of given string in file: ${filePath}`
    } else {
      return `Successfully replaced ${numberOfReplacements} instances of given string in file: ${filePath}`
    }
  } catch (err) {
    return `Failed to replace text in file: ${filePath}`
  }
}
