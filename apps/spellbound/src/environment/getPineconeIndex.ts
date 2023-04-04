import * as vscode from "vscode"

export function getPineconeIndex() {
  const pinecone_index =
    vscode.workspace
      .getConfiguration("spellbound")
      .get<string>("pinecone_index") || process.env.PINECONE_INDEX

  if (!pinecone_index) {
    vscode.window.showWarningMessage(
      "No Pinecone Index found. Please set the 'spellbound.pinecone_index' setting or set the PINECONE_INDEX environment variable."
    )
  }

  return pinecone_index
}
