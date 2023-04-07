import { askToolImpl } from "./ask/askToolImpl"
import { catToolImpl } from "./cat/catToolImpl"
import { doneToolImpl } from "./done/doneToolImpl"
import { lsToolImpl } from "./ls/lsToolImpl"
import { npmToolImpl } from "./npm/npmToolImpl"
import { gitToolImpl } from "./git/gitToolImpl"
import { searchToolImpl } from "./search/searchToolImpl"
import { statsToolImpl } from "./stats/statsToolImpl"
import { writeToolImpl } from "./write/writeToolImpl"
import { diffToolImpl } from "./diff/diffToolImpl"
import { grepToolImpl } from "./grep/grepToolImpl"
import { moveToolImpl } from "./move/moveToolImpl"


export const ToolEngine = {
  ask: [askToolImpl, 
    "ask {question}", 
    "Ask the user a question"],

  cat: [catToolImpl, 
    "cat {path}",
    "Read the content of a file at the given path."],

  done: [doneToolImpl,
    "done",
    "This '## Thought' is the final chain-of-reasoning conclusion."],

  ls: [lsToolImpl,
    "ls {regex}",
    "List all files in the workspace with path matching the given regex."],

  npm: [npmToolImpl,
    "npm {args}",
    "Run an npm command (e.g., `npm i some-package`)."],

  git: [gitToolImpl,
    "git {args}",
    "Run an git command with optional arguments. End your commit messages with '(By SB)'"],

  search: [searchToolImpl,
    "search {topic}",
    "Search for a topic in the vector-embedding database."],

  stats: [statsToolImpl,
    "stats",
    "List available vector embedding namespaces"],

  write: [writeToolImpl,
    "write {path, contents}",
    "Write (or overwrite) the given contents into the specified file. Takes a long time to large."],
    
  diff: [diffToolImpl,
    "diff {source, patchStr}",
    "For _modifying_ files. Takes filename and unified diff patch string."],

  grep: [grepToolImpl,
    "grep {regex, path?}",
    "Perform a grep search with the specified list of glob patterns and a regex query."],

  move: [moveToolImpl,
    "move {source, dest}",
    "Move a file or folder from source to destination. Paths relative to workspace root."]
    
} as const
