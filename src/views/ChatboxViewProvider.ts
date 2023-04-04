import * as vscode from "vscode"
import markdownit from "markdown-it"
import { Message, streamInference } from "../api/openai"
import { fillPrompt } from "../prompts/fillPrompt"

import YAML from "yaml"
import { AnyToolInterface } from "../tools/AnyToolInterface"
import { ToolEngine } from "../tools/ToolEngine"
import { readFileSync } from "fs"

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

    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "sendPrompt":
          this.handleSendPrompt(webviewView, message.messages)
          break
      }
    })
  }

  async handleSendPrompt(webviewView: vscode.WebviewView, messages: Message[]) {
    const filledPrompt = await fillPrompt({
      task: messages[0].content,
    })

    // Replace contents of first message with template prompt.
    const updatedMessages = [
      {
        role: messages[0].role,
        content: filledPrompt,
      },
      ...messages.slice(1),
    ]

    const onStart = () => {
      webviewView.webview.postMessage({
        command: "sendMessage",
        message: { content: "", type: "start" },
      })
    }

    let buffer = ""

    const onData = (output: string) => {
      buffer += output
      const rendered = this.md.render(buffer)
      webviewView.webview.postMessage({
        command: "sendMessage",
        message: { content: output, rendered, type: "chunk" },
      })
    }

    const onEnd = () => {
      webviewView.webview.postMessage({
        command: "sendMessage",
        message: { content: "", type: "done" },
      })

      // At this point, we may determine if the LLM used a tool or not. If so,
      // we should execute that tool and send the result as a message.
      this.handleToolMessage(webviewView, {
        role: "assistant",
        content: buffer,
      })
    }

    // Update the chat UI with the user's prompt
    webviewView.webview.postMessage({
      command: "sendMessage",
      message: {
        content: messages[messages.length - 1].content,
        type: "input",
        rendered: this.md.render(messages[messages.length - 1].content),
      },
    })

    onStart()

    // Call the streamInference function
    await streamInference(updatedMessages, {
      onData,
      onEnd,
    })
  }

  private async handleToolMessage(
    webviewView: vscode.WebviewView,
    message: Message
  ) {
    const actionRegex = /## Action\n+```.*\n([^]+)```/g
    const match = actionRegex.exec(message.content)

    if (match) {
      try {
        const actionObject = YAML.parse(match[1], { strict: false })

        // Handle the tool action here
        const toolResult = await this.executeToolAction(actionObject)

        // Some tools purposefully don't return a result
        if (toolResult) {
          // Wrap the tool result in nice output.
          const toolResultOutput = `## Result\n\`\`\`\n${toolResult}\n\`\`\``

          // Send the tool result as a message
          webviewView.webview.postMessage({
            command: "sendMessage",
            message: {
              content: toolResultOutput,
              type: "tool-result",
            },
          })
        }
      } catch (err: any) {
        console.error("FULL_MESSAGE", message.content)
        console.error("REGEX_MATCH", match[1])
        console.error("Error parsing tool action:", err)

        const errorMessage = `ERROR: Could not parse tool action: ${err?.message}`

        webviewView.webview.postMessage({
          command: "sendMessage",
          message: {
            content: errorMessage,
            type: "tool-result",
          },
        })
      }
    } else {
      console.error("No tool action found in message:\n\n", message.content)
    }
  }

  private async executeToolAction(
    actionObject: AnyToolInterface
  ): Promise<string | undefined> {
    if (!actionObject.tool) {
      return
    }

    try {
      const tool = actionObject.tool
      const result = await ToolEngine[tool](actionObject as never)
      return result
    } catch (error) {
      return `ERROR: Unknown tool: ${(actionObject as any)?.tool}`
    }
  }

  private getChatboxHtml() {
    const scriptFilename = "webview/build/static/js/main.js"
    const scriptUri = this.extensionUri.with({
      path: this.extensionUri.path + "/" + scriptFilename,
    })
    // load script text
    const scriptText = readFileSync(scriptUri.fsPath, "utf8")

    const stylesFilename = "webview/build/static/css/main.css"
    const stylesUri = this.extensionUri.with({
      path: this.extensionUri.path + "/" + stylesFilename,
    })
    // load script text
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
        <script>${scriptText}</script>
      </body>
      </html>
    `
  }
}
