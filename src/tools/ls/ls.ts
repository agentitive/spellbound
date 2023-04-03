import path, { relative } from "path"
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

  const filterFunction = (file: string) => {
    const relativePath = path.relative(basePath, file)
    return (
      !ig.ignores(path.relative(basePath, file)) &&
      !relativePath.startsWith(".git/")
    )
  }

  const absoluteDirectory = path.join(basePath, directory)

  const files = await collectFiles(absoluteDirectory, filterFunction, recursive)

  if (typeof files === "string") {
    return files
  }

  return files
    .map((x) => relative(basePath, x))
    .map((x) => `- ${x}`)
    .join("\n")
}
