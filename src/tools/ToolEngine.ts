import { askToolImpl } from "./ask/askToolImpl"
import { catToolImpl } from "./cat/catToolImpl"
import { doneToolImpl } from "./done/doneToolImpl"
import { lsToolImpl } from "./ls/lsToolImpl"
import { npmToolImpl } from "./npm/npmToolImpl"
import { replaceToolImpl } from "./replace/replaceToolImpl"
import { searchToolImpl } from "./search/searchToolImpl"
import { statsToolImpl } from "./stats/statsToolImpl"
import { writeToolImpl } from "./write/writeToolImpl"

export const ToolEngine = {
  ask: askToolImpl,
  cat: catToolImpl,
  done: doneToolImpl,
  ls: lsToolImpl,
  npm: npmToolImpl,
  replace: replaceToolImpl,
  search: searchToolImpl,
  stats: statsToolImpl,
  write: writeToolImpl,
}
