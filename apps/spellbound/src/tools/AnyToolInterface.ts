import { CatToolInterface } from "./cat/CatToolInterface"
import { LsToolInterface } from "./ls/LsToolInterface"
import { SearchToolInterface } from "./search/SearchToolInterface"
import { WriteToolInterface } from "./write/WriteToolInterface"
import { AskToolInterface } from "./ask/AskToolInterface"
import { NpmToolInterface } from "./npm/NpmToolInterface"
import { DoneToolInterface } from "./done/DoneToolInterface"
import { StatsToolInterface } from "./stats/StatsToolInterface"
import { GitToolInterface } from "./git/GitToolInterface"
import { GrepToolInterface } from "./grep/GrepToolInterface"

export type AnyToolInterface =
  | CatToolInterface
  | LsToolInterface
  | SearchToolInterface
  | WriteToolInterface
  | GrepToolInterface
  | AskToolInterface
  | NpmToolInterface
  | GitToolInterface
  | DoneToolInterface
  | StatsToolInterface
