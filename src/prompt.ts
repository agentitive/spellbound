import ejs from "ejs"
import { promises as fs } from "fs"
import path from "path"

type FillPromptParams = {
  codebase_description: string
  language: string
  task: string
  current_file_name: string
  langcode: string
  current_file_contents: string
}

const fillPrompt = async (params: FillPromptParams): Promise<string> => {
  // Read file
  const promptFilePath = path.join(__dirname, "src", "prompt.md")
  const sourcePrompt = await fs.readFile(promptFilePath, "utf-8")

  // Fill out the prompt
  const filledPrompt = ejs.render(sourcePrompt, params)

  return filledPrompt
}

export default fillPrompt
