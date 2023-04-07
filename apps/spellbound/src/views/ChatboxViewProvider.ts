import * as vscode from "vscode"
import markdownit from "markdown-it"
import { readFileSync } from "fs"
import { Message, WebviewProcedures, createBirpc } from "spellbound-shared"
import { AgentLogicHandler } from "../agent/AgentLogicHandler"

export class ChatboxViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) { }

  private md = markdownit({
    html: true,
    breaks: true,
  })

  messagesToHumanReadable(messages: Message[]): string {
    return messages
      .map(message => `[${message.role === 'agent' ? 'Agent' : 'User'}]:\n${message.content}`)
      .join('\n')
  }

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    }

    webviewView.webview.html = this.getChatboxHtml()

    const agentLogicHandler = new AgentLogicHandler(
      createBirpc<WebviewProcedures>({
        abort: () => {
          agentLogicHandler.abortFlag = true
        },
        submit: async (messages: Message[]) => {
          agentLogicHandler.abortFlag = false
          return await agentLogicHandler.handleSendPrompt(messages)
        },
        saveToFile: async (messages: Message[]) => {
          try {
            const saveUri = await vscode.window.showSaveDialog({
              filters: {
                "Markdown Files": ["md"],
                "Text Files": ["txt"]
              },
              saveLabel: "Save Chat Messages",
              title: "Save Chat Messages As"
            })

            if (saveUri) {
              const formattedMessages = this.messagesToHumanReadable(messages)
              await vscode.workspace.fs.writeFile(saveUri, Buffer.from(formattedMessages))
              vscode.window.showInformationMessage("Chat messages saved successfully.")
            }
          } catch (error) {
            vscode.window.showErrorMessage(`Error saving file: ${(error as Error).message}`)
          }
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
    )
  }

  private getChatboxCss() {
    const stylesFilename = "static/main.css"
    const stylesUri = this.extensionUri.with({
      path: this.extensionUri.path + "/" + stylesFilename,
    })
    return readFileSync(stylesUri.fsPath, "utf8")
  }

  private getChatboxJs() {
    const scriptFilename = "static/main.js"
    const scriptUri = this.extensionUri.with({
      path: this.extensionUri.path + "/" + scriptFilename,
    })
    return readFileSync(scriptUri.fsPath, "utf8")
  }

  private getChatboxHtml() {
    const stylesText = this.getChatboxCss()
    const scriptText = this.getChatboxJs()

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
