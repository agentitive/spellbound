import { readFileSync } from 'fs'
import { join } from 'path'

import { GrepToolInterface } from './GrepToolInterface'
import * as vscode from 'vscode'
import { globby } from "globby"


type GrepResult = {
  line: string
  lineNumber: number
}

export async function grepToolImpl(params: GrepToolInterface) {
  const { globs, regex } = params
  const cwd = vscode.workspace.workspaceFolders?.[0].uri.fsPath || process.cwd()
  const regexp = new RegExp(regex)
  const files = (await globby(globs, { cwd }))
    .filter(file => !file.includes("node_modules"))
  const results: Record<string, GrepResult[]> = {}

  for (const file of files.slice(0, 10)) {
    const text = readFileSync(join(cwd, file), "utf8")
    const lines = text.split("\n")
    const matches = lines.map((line, lineNumber) => ({ file, line, lineNumber })).filter(({ line }) => regexp.test(line))

    if (matches.length === 0) { 
      continue
    }

    results[file] = matches
  }

  const renderMatch = ({ lineNumber, line }: GrepResult) => ` - ${lineNumber}: ${line}`
  const render = (file: string, matches: GrepResult[]) => `${file}:\n${matches.map(renderMatch).join("\n")}\n`
  const entries = Object.entries(results)
  return entries.map(([file, matches]) => render(file, matches)).join("\n")
}
