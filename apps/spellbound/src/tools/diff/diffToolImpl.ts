import * as vscode from "vscode"
import fs from "fs"
import path from "path"

import { DiffToolInterface } from "./DiffToolInterface"
import { applyPatch, parsePatch } from "diff"

export async function diffToolImpl(params: DiffToolInterface): Promise<string> {
  const {source, patchStr} = params
  
  try {
    const patches = parsePatch(patchStr)
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath
    const filename = path.join(workspaceRoot || "", source)
    const text = fs.readFileSync(filename, "utf8")
    const patchedText = applyPatch(text, patches[0])
    fs.writeFileSync(filename, JSON.stringify(patchedText))
    return patchedText
  } catch (err: any) {
    return `ERROR: Failed to apply diff patch: ${err?.message || 'Unknown error'}`
  }
}
