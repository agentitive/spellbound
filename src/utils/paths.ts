import * as vscode from "vscode"

import { join } from "path"

export const makeRelative = 
    (path: string) => 
        path.replace(vscode.workspace.workspaceFolders?.[0].uri.fsPath!, "")

export const makeAbsolute =
    (path: string) =>
        join(vscode.workspace.workspaceFolders?.[0].uri.fsPath!, path)