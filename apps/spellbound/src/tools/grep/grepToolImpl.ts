import { GrepToolInterface } from './GrepToolInterface'
import { runGitCommand } from '../git/utility/runGitCommand'


type GrepResult = {
  line: string
  lineNumber: number
}

export async function grepToolImpl({ regex, path }: GrepToolInterface) {
  const result = await runGitCommand(`grep --exclude-standard --no-index -e '${regex}' -- ${path || '.'}`)
  if (result.startsWith('ERROR')) {
    return "No files found."
  }
  return result
    .split('\n')
    .slice(1, -1)
    .join('\n') || 'No files found'
}
