import * as vscode from 'vscode'

import { BirpcReturn, Message, WebviewProcedures } from 'spellbound-shared'
import { fillPrompt } from '../prompts/fillPrompt'
import { streamInference } from '../api/openai'
import YAML from 'yaml'
import { AnyToolInterface } from '../tools/AnyToolInterface'
import { ToolEngine } from '../tools/ToolEngine'

export class AgentLogicHandler {
  abortFlag = false

  constructor(private readonly rpc: BirpcReturn<WebviewProcedures, {}>) { }

  async handleSendPrompt(messages: Message[]) {
    const updatedMessages = await this.createUpdatedMessages(messages)

    const onStart = async () => {
      if (!this.abortFlag) {
        await this.onStartHandler()
      }
    }

    let buffer = ''

    const onData = async (output: string) => {
      if (!this.abortFlag) {
        buffer = await this.onDataHandler(buffer, output)
      }
    }

    const onEnd = async () => {
      if (!this.abortFlag) {
        await this.onEndHandler(buffer, messages)
      }
    }

    onStart()

    await streamInference(updatedMessages, {
      onData,
      onEnd,
    })
  }

  private async createUpdatedMessages(messages: Message[]): Promise<Message[]> {
    const userMessages = messages.filter(m => m.role === 'user')
    const filledPrompt = await fillPrompt({
      task: userMessages[userMessages.length - 1].content,
    })

    return [
      {
        role: 'system',
        content: filledPrompt,
      },
      ...messages,
    ]
  }

  private async onStartHandler() {
    await this.rpc.start()
  }

  private async onDataHandler(buffer: string, output: string): Promise<string> {
    buffer += output
    await this.rpc.update(output)
    return buffer
  }

  private async onEndHandler(buffer: string, messages: Message[]) {
    await this.rpc.finish()

    this.handleToolMessage([...messages, {
      role: 'assistant',
      content: buffer,
    }])
  }

  private async handleToolMessage(messages: Message[]) {
    const actionObject = await this.extractActionObject(messages)
    if (actionObject) {
      const toolResult = await this.executeToolAction(actionObject)

      if (toolResult) {
        const resultMessage = await this.createResultMessage(toolResult)
        await this.handleSendPrompt([...messages, resultMessage])
      }
    } else {
      const warningResult = `No tool action found in message.`
      console.warn("warningResult:", messages[messages.length - 1].content)
      // TODO: make this a setting "run until done"
      const resultMessage = await this.createResultMessage(warningResult)
      await this.handleSendPrompt([...messages, resultMessage])
    }
  }

  private async extractActionObject(messages: Message[]) {
    const lastMessage = messages[messages.length - 1]
    const actionRegex = /^\s*##\s*Action\s*\n+```[\s\S]*?\n([^]+?)```/gm
    const match = actionRegex.exec(lastMessage.content)

    if (match) {
      try {
        return YAML.parse(match[1], { strict: false })
      } catch (err: any) {
        console.error('FULL_MESSAGE', lastMessage.content)
        console.error('REGEX_MATCH', match[1])
        console.error('Error parsing tool action:', err)
        // get the extension setting .agent.stopOnError
        const errorMessage = `ERROR: Could not parse tool action: ${err?.message}`

        const stopOnError = vscode.workspace.getConfiguration('spellbound').get('agent.stopOnError')
        if (stopOnError) {
          return await this.rpc.result(errorMessage)
        }

        const resultMessage = await this.createResultMessage(errorMessage)
        await this.handleSendPrompt([...messages, resultMessage])
      }
    }
    return null
  }

  private async createResultMessage(toolResult: string): Promise<Message> {
    const toolResultOutput = `## Result\n\`\`\`\n${toolResult}\n\`\`\``
    await this.rpc.result(toolResultOutput)
    return {
      role: 'system',
      content: toolResultOutput,
    }
  }

  private async executeToolAction(actionObject: AnyToolInterface): Promise<string | undefined> {
    if (!actionObject.tool) {
      return
    }

    try {
      const tool = actionObject.tool
      const [impl] = ToolEngine[tool]
      return await impl(actionObject as never)
    } catch (error) {
      return `ERROR: Unknown tool: ${(actionObject as any)?.tool}`
    }
  }
}