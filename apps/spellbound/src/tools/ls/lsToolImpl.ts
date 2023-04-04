import path, { relative } from "path"
import ignore from "ignore"
import { collectFiles } from "./utility/collectFiles"
import { readGitIgnore } from "./utility/readGitIgnore"
import * as vscode from "vscode"
import { LsToolInterface } from "./LsToolInterface"

export async function lsToolImpl(params: LsToolInterface): Promise<string> {
  const { path: directory, recursive } = params

  const basePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

  if (!basePath) {
    return `ERROR: No workspace folder opened.`
  }

  const ig = ignore()
  const gitignorePatterns = await readGitIgnore(basePath)

  if (typeof gitignorePatterns === "string") {
    return gitignorePatterns
  }

  ig.add(gitignorePatterns)

  const filterFunction = (file: string) => {
    const relativePath = path.relative(basePath, file)
    return (
      !ig.ignores(path.relative(basePath, file)) &&
      !relativePath.startsWith(".git/")
    )
  }

  const absoluteDirectory = path.join(basePath, directory)

  const files = await collectFiles(
    absoluteDirectory,
    filterFunction,
    recursive ?? false
  )

  if (typeof files === "string") {
    return files
  }

  return files
    .map((x) => relative(basePath, x))
    .map((x) => `- ${x}`)
    .join("\n")
}
