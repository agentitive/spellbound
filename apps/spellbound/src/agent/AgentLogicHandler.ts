import { BirpcReturn, Message, WebviewProcedures } from "spellbound-shared"
import { fillPrompt } from "../prompts/fillPrompt"
import { streamInference } from "../api/openai"
import YAML from "yaml"
import { AnyToolInterface } from "../tools/AnyToolInterface"
import { ToolEngine } from "../tools/ToolEngine"

export class AgentLogicHandler {
  constructor(private readonly rpc: BirpcReturn<WebviewProcedures, {}>) {}

  async handleSendPrompt(messages: Message[]) {
    const updatedMessages = await this.createUpdatedMessages(messages)

    const onStart = async () => {
      await this.onStartHandler()
    }

    let buffer = ""

    const onData = async (output: string) => {
      buffer = await this.onDataHandler(buffer, output)
    }

    const onEnd = async () => {
      await this.onEndHandler(buffer, messages)
    }

    onStart()

    await streamInference(updatedMessages, {
      onData,
      onEnd,
    })
  }

  private async createUpdatedMessages(messages: Message[]): Promise<Message[]> {
    const filledPrompt = await fillPrompt({
      task: messages[0].content,
    })

    return [
      {
        role: messages[0].role,
        content: filledPrompt,
      },
      ...messages.slice(1),
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
      role: "assistant",
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
      console.error("No tool action found in message:\n\n", messages[messages.length - 1].content)
    }
  }

  private async extractActionObject(messages: Message[]) {
    const lastMessage = messages[messages.length - 1]
    const actionRegex = /## Action\n+```.*\n([^]+)```/g
    const match = actionRegex.exec(lastMessage.content)

    if (match) {
      try {
        return YAML.parse(match[1], { strict: false })
      } catch (err: any) {
        console.error("FULL_MESSAGE", lastMessage.content)
        console.error("REGEX_MATCH", match[1])
        console.error("Error parsing tool action:", err)
        const errorMessage = `ERROR: Could not parse tool action: ${err?.message}`
        await this.rpc.result(errorMessage)
      }
    }
    return null
  }

  private async createResultMessage(toolResult: string): Promise<Message> {
    const toolResultOutput = `## Result\n\`\`\`\n${toolResult}\n\`\`\``
    await this.rpc.result(toolResultOutput)
    return {
      role: "assistant",
      content: toolResultOutput,
    }
  }

  private async executeToolAction(actionObject: AnyToolInterface): Promise<string | undefined> {
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
}
