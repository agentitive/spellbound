import { promises as fs } from "fs"
import path from "path"
import * as vscode from "vscode"
import ignore from "ignore"

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

async function readGitignore(
  workspacePath: string
): Promise<string[] | string> {
  const gitignorePath = path.join(workspacePath, ".gitignore")

  try {
    const gitignoreContent = await fs.readFile(gitignorePath, "utf8")
    return gitignoreContent.split(/\r?\n/)
  } catch (err) {
    return `ERROR: Failed to read .gitignore file: ${err}`
  }
}

async function collectFiles(
  directory: string,
  filterFunction: (file: string) => boolean,
  recursive: boolean,
  collected?: string[] // for internal recursive use
): Promise<string[] | string> {
  if (!collected) {
    collected = []
  }

  try {
    const entries = await fs.readdir(directory, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory() && recursive) {
        await collectFiles(entryPath, filterFunction, recursive, collected)
      } else if (entry.isFile()) {
        if (filterFunction(entryPath)) {
          collected.push(entryPath)
        }
      }
    }
  } catch (err) {
    return `ERROR: Failed to read directory contents: ${err}`
  }

  return collected
}

export async function ls(
  directory: string,
  recursive = false
): Promise<string> {
  const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath
  if (!workspacePath) {
    throw new Error("No workspace folder found.")
  }

  const ig = ignore()
  const gitignorePatterns = await readGitignore(workspacePath)

  if (typeof gitignorePatterns === "string") {
    return gitignorePatterns
  }

  ig.add(gitignorePatterns)

  const filterFunction = (file: string) =>
    !ig.ignores(path.relative(workspacePath, file))

  const files = await collectFiles(directory, filterFunction, recursive)

  if (typeof files === "string") {
    return files
  }

  return files.map((x) => `- ${x}`).join("\n")
}
