import { LsToolInterface } from "./LsToolInterface"
import { runGitCommand } from "../git/utility/runGitCommand"

export async function lsToolImpl({ regex }: LsToolInterface): Promise<string> {
  return (await runGitCommand("ls-files --exclude=node_modules --exclude-standard --deduplicate"))
    .split("\n")
    .slice(1, -1)
    .filter((x) => RegExp(regex).test(x))
    .map((x) => `- ${x}`)
    .join("\n") || "No files found"
}
