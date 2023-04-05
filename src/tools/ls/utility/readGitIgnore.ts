import { promises as fs } from "fs"
import path from "path"

export async function readGitIgnore(
  workspacePath: string
): Promise<string[] | string> {
  const gitignorePath = path.join(workspacePath, ".gitignore")

  try {
    const gitignoreContent = await fs.readFile(gitignorePath, "utf8")
    return gitignoreContent.split(/\r?\n/)
  } catch (err) {
    return []
  }
}
