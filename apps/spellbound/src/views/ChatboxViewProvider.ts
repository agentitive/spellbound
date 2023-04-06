import * as vscode from "vscode"
import markdownit from "markdown-it"
import { readFileSync } from "fs"
import { Message, WebviewProcedures, createBirpc } from "spellbound-shared"
import { AgentLogicHandler } from "../agent/AgentLogicHandler"

export class ChatboxViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  private md = markdownit({
    html: true,
    breaks: true,
  })

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    }

    webviewView.webview.html = this.getChatboxHtml()

    const rpc = createBirpc<WebviewProcedures>({
      submit: async (messages: Message[]) => {
        const agentLogicHandler = new AgentLogicHandler(rpc)
        return await agentLogicHandler.handleSendPrompt(messages)
      }
    }, {
      post: data => {
        webviewView.webview.postMessage(data)
      },
      on: data => {
        webviewView.webview.onDidReceiveMessage(e => {
          data(e)
        })
      },
    })
  }

  private getChatboxHtml() {
    const scriptFilename = "static/main.js"
    const scriptUri = this.extensionUri.with({
      path: this.extensionUri.path + "/" + scriptFilename,
    })
    const scriptText = readFileSync(scriptUri.fsPath, "utf8")

    const stylesFilename = "static/main.css"
    const stylesUri = this.extensionUri.with({
      path: this.extensionUri.path + "/" + stylesFilename,
    })
    const stylesText = readFileSync(stylesUri.fsPath, "utf8")

    return /* html */`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chatbox</title>
        <style>
          body, html {
            height: 100vh;
            overflow: hidden;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #CCC;
            background-color: #020408;
          }
          ${stylesText}
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          ${scriptText}
        </script>
      </body>
      </html>
    `
  }
}
