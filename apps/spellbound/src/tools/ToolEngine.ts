import { askToolImpl } from "./ask/askToolImpl"
import { catToolImpl } from "./cat/catToolImpl"
import { doneToolImpl } from "./done/doneToolImpl"
import { lsToolImpl } from "./ls/lsToolImpl"
import { npmToolImpl } from "./npm/npmToolImpl"
import { gitToolImpl } from "./git/gitToolImpl"
import { replaceToolImpl } from "./replace/replaceToolImpl"
import { searchToolImpl } from "./search/searchToolImpl"
import { statsToolImpl } from "./stats/statsToolImpl"
import { writeToolImpl } from "./write/writeToolImpl"
import { diffToolImpl } from "./diff/diffToolImpl"

export const ToolEngine = {
  ask: askToolImpl,
  cat: catToolImpl,
  done: doneToolImpl,
  ls: lsToolImpl,
  npm: npmToolImpl,
  git: gitToolImpl,
  replace: replaceToolImpl,
  search: searchToolImpl,
  stats: statsToolImpl,
  write: writeToolImpl,
  diff: diffToolImpl,
}
