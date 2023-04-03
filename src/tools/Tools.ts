import { exec } from "child_process"
import { promises as fs } from "fs"
import path from "path"
import * as vscode from "vscode"

export type ToolObject =
  | {
      /**
       * The `cat` tool prints the contents of a file to the chatbox.
       */
      tool: "cat"
      path: string
    }
  | {
      /**
       * The `ls` tool prints the contents of a directory to the chatbox.
       * All directories in .gitignore are ignored.
       */
      tool: "ls"
      path: string
      recursive?: boolean
    }
  | {
      /**
       * The `search` tool uses the Pinecone vector search engine to find
       * the most similar documents to the given query.
       */
      tool: "search"
      description: string
    }
  | {
      /**
       * The `write` tool writes the given contents to the given path.
       */
      tool: "write"
      path: string
      contents: string
    }
  | {
      /**
       * The `replace` tool replaces all instances of `old` with `new` in the
       * given file.
       */
      tool: "replace"
      path: string
      old: string
      new: string
    }
  | {
      /**
       * The `ask` tool asks the user a question and waits for a response.
       */
      tool: "ask"
      question: string
    }
  | {
      /**
       * The `npm` tool runs the given npm script.
       */
      tool: "npm"
      script: string
    }
  | {
      /**
       * The `done` tool indicates that the LLM is done with the current task.
       */
      tool: "done"
    }

export async function cat(relativeFilePath: string): Promise<string> {
  const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  if (!workspacePath) {
    return `ERROR: No workspace folder currently open`
  }

  const absoluteFilePath = path.join(workspacePath, relativeFilePath)

  try {
    const contents = await fs.readFile(absoluteFilePath, "utf8")
    return contents
  } catch (err) {
    return `ERROR: Failed to read file: ${relativeFilePath}`
  }
}

export async function search(description: string) {
  // Implement Pinecone vector search
  return undefined
}

export async function write(
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

export async function replace(
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

export async function ask(_question: string) {
  return undefined
}

export async function npmScript(script: string): Promise<string> {
  // Base off of workspace directory
  const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  if (!workspacePath) {
    throw new Error("No workspace folder found.")
  }

  // Use the helper function to run the npm script
  return await runNpmCommand(`run ${script}`, workspacePath)
}

async function runNpmCommand(script: string, cwd: string): Promise<string> {
  // Validate that 'script' doesn't contain ; or &
  if (script.includes(";") || script.includes("&")) {
    return `ERROR: Invalid npm script: ${script}`
  }

  return new Promise((resolve, reject) => {
    // Execute the npm command in the provided working directory
    exec(`npm run ${script}`, { cwd }, (error, stdout, stderr) => {
      if (error) {
        const errorMessage = `ERROR: Failed to run npm command: ${script}\n${stderr}`
        console.error(errorMessage)
        resolve(errorMessage)
      } else {
        const successMessage = `Successfully ran npm command: ${script}\n${stdout}`
        resolve(successMessage)
      }
    })
  })
}

export async function done() {
  return undefined
}
