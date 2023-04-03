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
       * The `ask` tool asks the user a question and waits for a response.
       */
      tool: "ask"
      question: string
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
  try {
    await fs.writeFile(filePath, contents, "utf8")
    return `File written to ${filePath}`
  } catch (err) {
    return `ERROR: Failed to write file: ${filePath}`
  }
}

export async function ask(_question: string) {
  return undefined
}

export async function done() {
  return undefined
}
