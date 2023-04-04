import * as vscode from "vscode"

export function getOpenAIKey() {
  const openai_api_key =
    vscode.workspace
      .getConfiguration("spellbound")
      .get<string>("openai_api_key") || process.env.OPENAI_API_KEY

  if (!openai_api_key) {
    vscode.window.showWarningMessage(
      "No OpenAI API key found. Please set the 'spellbound.openai_api_key' setting or set the OPENAI_API_KEY environment variable."
    )
  }

  return openai_api_key
}
