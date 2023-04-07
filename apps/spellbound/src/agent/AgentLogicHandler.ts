import * as vscode from 'vscode'

import { BirpcReturn, Message, WebviewProcedures } from 'spellbound-shared'
import { fillPrompt } from '../prompts/fillPrompt'
import YAML from 'yaml'
import { AnyToolInterface } from '../tools/AnyToolInterface'
import { ToolEngine } from '../tools/ToolEngine'
import { InferenceService } from '../inference/InferenceHandler'

export class AgentLogicHandler {
  aborted = false
  inferences: InferenceService

  constructor(private readonly rpc: BirpcReturn<WebviewProcedures, {}>) { 
    this.inferences = new InferenceService()
  }

  async abort() {
    this.aborted = true
    this.inferences.abort()
    await this.rpc.finish()
  }

  async promptAgent(messages: Message[]) {
    const updatedMessages = await this.createUpdatedMessages(messages)
    this.aborted = false
    this.inferences.infer(
      updatedMessages, 
      () => this.onStartHandler(), 
      (data: string) => this.onDataHandler(data),
      (result: string) => this.onEndHandler(messages, result))
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

  private async onDataHandler(output: string) {
    await this.rpc.update(output)
  }

  private async onEndHandler(messages: Message[], result: string) {
    await this.rpc.finish()

    if (this.aborted) {
      return
    }
    
    this.handleToolMessage([
      ...messages, 
      {
        role: 'assistant',
        content: result,
      }
    ])
  }

  private async sendResultMessage(messages: Message[], toolResult: string) {
    const resultMessage = await this.createResultMessage(toolResult)
    await this.rpc.result(resultMessage.content)

    if (!this.aborted) { // TODO: make this a setting "run until done"
      // this causes the agent to respond to result messages
      await this.promptAgent([...messages, resultMessage])
    }
  }  

  private async handleToolMessage(messages: Message[]) {
    if (this.aborted) {
      return
    }

    const actionObject = await this.extractActionObject(messages)
    if (actionObject) {
      const toolResult = await this.executeToolAction(actionObject)

      if (toolResult) {
        await this.sendResultMessage(messages, toolResult)
      }
    } else {
      const warningResult = `No tool action found in message.`
      console.warn("warningResult:", messages[messages.length - 1].content)
      await this.sendResultMessage(messages, warningResult)
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

        await this.sendResultMessage(messages, errorMessage)
      }
    }
    return null
  }

  private async createResultMessage(toolResult: string): Promise<Message> {
    const toolResultOutput = `## Result\n\`\`\`\n${toolResult}\n\`\`\``
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