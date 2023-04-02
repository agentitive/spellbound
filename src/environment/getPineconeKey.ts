import * as vscode from "vscode"

export function getPineconeKey() {
  const pinecone_api_key =
    vscode.workspace
      .getConfiguration("spellbound")
      .get<string>("pinecone_api_key") || process.env.PINECONE_API_KEY

  if (!pinecone_api_key) {
    vscode.window.showWarningMessage(
      "No Pinecone API key found. Please set the 'spellbound.pinecone_api_key' setting or set the PINECONE_API_KEY environment variable."
    )
  }

  return pinecone_api_key
}
