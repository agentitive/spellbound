import { join, relative } from "path"
import { getCurrentWorkspaceFolder } from "./getCurrentWorkspaceFolder"

export const makeRelative = (path: string) =>
  relative(getCurrentWorkspaceFolder(), path)

export const makeAbsolute = (path: string) =>
  join(getCurrentWorkspaceFolder(), path)
