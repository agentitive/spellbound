import * as vscode from "vscode"

export class ChatboxViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {
    console.log("Chatbox view provider created")
  }

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    }

    webviewView.webview.html = this.getChatboxHtml()

    console.log("Chatbox view resolved")

    // Implement the functionality of the chatbox here.
  }

  private getChatboxHtml() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chatbox</title>
      </head>
      <body>
        <!-- Add your chatbox HTML code here -->
        <h1>Chatbox</h1>
      </body>
      </html>
    `
  }
}
