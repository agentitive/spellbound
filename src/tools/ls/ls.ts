import path from "path"
import ignore from "ignore"
import { collectFiles } from "./collectFiles"
import { readGitignore } from "./readGitignore"

export async function ls(
  basePath: string,
  directory: string,
  recursive = false
): Promise<string> {
  const ig = ignore()
  const gitignorePatterns = await readGitignore(basePath)

  if (typeof gitignorePatterns === "string") {
    return gitignorePatterns
  }

  ig.add(gitignorePatterns)

  const filterFunction = (file: string) =>
    !ig.ignores(path.relative(basePath, file)) && !file.startsWith(".git/")

  const files = await collectFiles(
    basePath,
    directory,
    filterFunction,
    recursive
  )

  if (typeof files === "string") {
    return files
  }

  return files.map((x) => `- ${x}`).join("\n")
}
