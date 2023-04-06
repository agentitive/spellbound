import { LsToolInterface } from "./LsToolInterface"
import { runGitCommand } from "../git/utility/runGitCommand"

export async function lsToolImpl(params: LsToolInterface): Promise<string> {
  const files = (await runGitCommand("ls-files")).split("\n")

  return files
    .slice(1, -1)
    .map((x) => `- ${x}`)
    .join("\n")
}
