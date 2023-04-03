import * as vscode from "vscode"
import markdownit from "markdown-it"
import { Message, streamInference } from "../api/openai"
import { fillPrompt } from "../prompts/fillPrompt"
import * as Tools from "../tools/Tools"
import * as ls from "../tools/ls/ls"
import YAML from "yaml"

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

        return `ERROR: Could not parse tool action: ${err?.message}`
      }
    } else {
      console.error("No tool action found in message:\n\n", message.content)
    }
  }

  private async executeToolAction(
    actionObject: Tools.ToolObject
  ): Promise<string | undefined> {
    if (!actionObject.tool) {
      return
    }

    switch (actionObject.tool) {
      case "cat":
        return await Tools.cat(actionObject.path)
      case "ls":
        const basePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

        if (!basePath) {
          return `ERROR: No workspace folder opened.`
        }

        return await ls.ls(basePath, actionObject.path, actionObject.recursive)
      case "search":
        return await Tools.search(actionObject.description)
      case "write":
        return await Tools.write(actionObject.path, actionObject.contents)
      case "replace":
        return await Tools.replace(
          actionObject.path,
          actionObject.old,
          actionObject.new
        )
      case "ask":
        return await Tools.ask(actionObject.question)
      case "npm":
        return await Tools.npmScript(actionObject.script)
      case "done":
        return await Tools.done()
      default:
        return `ERROR: Unknown tool: ${(actionObject as any)?.tool}`
    }
  }

  private getChatboxHtml() {
    let sendButtonScript = `
    (function () {
      const vscode = acquireVsCodeApi();

      const sendButton = document.querySelector('#input-area button');
      const inputField = document.querySelector('#input-area input');
      const messageHistoryContainer = document.querySelector("#message-history");

      const messages = []

      sendButton.addEventListener("click", () => {
        const prompt = inputField.value.trim()
        if (prompt) {
          // Pass the prompt to the extension
          vscode.postMessage({
            command: "sendPrompt",
            messages: [...messages, { role: "system", content: prompt }],
          })
          inputField.value = ""
        }
      })
  
      inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          sendButton.click();
        }
      });

      function addMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = message.type === 'input' ? 'user-message' : 'response-message';
        messageElement.textContent = message.content;
        messageHistoryContainer.appendChild(messageElement);

        if (message.type === 'input') {
          messageElement.innerHTML = message.rendered;
        }

        if (message.type === 'start' || message.type === 'input') {
          messages.push({
            role: message.type === 'input' ? 'system' : 'assistant',
            content: message.content ?? "",
          })
        }
      }
      
      // Add a message event listener to handle 'addMessage' command
      window.addEventListener('message', (event) => {
        const message = event.data; // The JSON data our extension sent
        switch (message.command) {
          case 'sendMessage':
            switch(message.message.type) {
              case 'start':
                addMessage(message.message);
                break;
              case 'chunk':
                const lastResponse = document.querySelector('.response-message:last-child');

                lastResponse.innerHTML = message.message.rendered;

                messages[messages.length - 1].content += message.message.content;
                break;
              case 'done':
                // Todo: re-enable the input area
                break;
              case 'input':
                addMessage(message.message);
                break;
              case 'tool-result':
                // Treat the tool result as a prompt (implement 'thought-loop')
                vscode.postMessage({
                  command: "sendPrompt",
                  messages: [...messages, { role: "system", content: message.message.content }]
                })
                break;
            }
            break;
        }
      });
    })();`

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'">

        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chatbox</title>
        <style>
          /* Add your chatbox CSS code here */
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #CCC;
            background-color: #020408;
          }
  
          #message-history {
            position: relative;
            overflow-y: auto;
            padding: 16px;
            height: calc(100% - 70px);
          }
        
          #input-area {
            position: absolute;
            bottom: 0;
            width: 95%;
            padding: 8px;
            display: flex;
          }
  
          #input-area input {
            flex-grow: 1;
            outline: none;
            border: none;
            border-radius: 2px;
            padding: 6px;
            font-size: 14px;
            color: #CCC;
            background-color: #0e1116;
          }
  
          #input-area input:focus {
            border: 1px solid #007fd4;
          }
          
          #input-area button {
            background-color: #438440;
            border: none;
            color: white;
            padding: 6px 12px;
            cursor: pointer;
            margin-left: 4px;
            font-size: 14px;
            border-radius: 2px;
            outline: none;
          }
  
          #input-area button:hover {
            background-color: #488848;
          }

          .user-message {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 8px;
            margin-bottom: 8px;
            border-radius: 4px;
          }
        
          .response-message {
            background-color: rgba(255, 255, 255, 0.2);
            padding: 8px;
            margin-bottom: 8px;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div id="message-history">
          <!-- Render your text message-style history here -->
        </div>
        <div id="input-area">
          <input type="text" placeholder="Message (Enter to send)">
          <button>></button>
        </div>
        <script>
          window.acquireVsCodeApi = acquireVsCodeApi
        </script>
        <script>
          ${sendButtonScript}
        </script>
      </body>
      </html>
    `
  }
}
