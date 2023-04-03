import { CatToolInterface } from "./cat/CatToolInterface"
import { LsToolInterface } from "./ls/LsToolInterface"
import { SearchToolInterface } from "./search/SearchToolInterface"
import { WriteToolInterface } from "./write/WriteToolInterface"
import { ReplaceToolInterface } from "./replace/ReplaceToolInterface"
import { AskToolInterface } from "./ask/AskToolInterface"
import { NpmToolInterface } from "./npm/NpmToolInterface"
import { DoneToolInterface } from "./done/DoneToolInterface"
import { StatsToolInterface } from "./stats/StatsToolInterface"

export type AnyToolInterface =
  | CatToolInterface
  | LsToolInterface
  | SearchToolInterface
  | WriteToolInterface
  | ReplaceToolInterface
  | AskToolInterface
  | NpmToolInterface
  | DoneToolInterface
  | StatsToolInterface
