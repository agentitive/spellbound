import * as vscode from "vscode"

export function getPineconeEnvironment() {
  const pinecone_environment =
    vscode.workspace
      .getConfiguration("spellbound")
      .get<string>("pinecone_environment") || process.env.PINECONE_ENVIRONMENT

  if (!pinecone_environment) {
    vscode.window.showWarningMessage(
      "No Pinecone environment found. Please set the 'spellbound.pinecone_environment' setting or set the PINECONE_ENVIRONMENT environment variable."
    )
  }

  return pinecone_environment
}
