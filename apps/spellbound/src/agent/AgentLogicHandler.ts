import { BirpcReturn, Message, WebviewProcedures } from "spellbound-shared"
import { fillPrompt } from "../prompts/fillPrompt"
import { streamInference } from "../api/openai"
import { AnyToolInterface } from "../tools/AnyToolInterface"
import { ToolEngine } from "../tools/ToolEngine"

function parseMessage(input: string) {
  const regex = /### `(\w+)`\n\n([^]+?)(?=\n##|\n###|$)/g
  const matches = Array.from(input.matchAll(regex))

  const parsedObject: Record<string, string> = {}
  matches.forEach(([_, key, value]) => {
    const cleanValue = value.trim().replace(/^```[\w]*\n([^]+)\n```$/, "$1")
    parsedObject[key] = cleanValue
  })

  return parsedObject
}

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
    const userMessages = messages.filter((m) => m.role === "user")
    const filledPrompt = await fillPrompt({
      task: userMessages[userMessages.length - 1].content,
    })

    return [
      {
        role: "system",
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

    this.handleToolMessage([
      ...messages,
      {
        role: "assistant",
        content: buffer,
      },
    ])
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

  private async extractActionObject(
    messages: Message[]
  ): Promise<AnyToolInterface | null> {
    const lastMessage = messages[messages.length - 1]

    const parameters = parseMessage(lastMessage.content)

    if (parameters.tool) {
      return parameters as AnyToolInterface
    }

    return null
  }

  private async createResultMessage(toolResult: string): Promise<Message> {
    const toolResultOutput = `## Result\n\`\`\`\n${toolResult}\n\`\`\``
    await this.rpc.result(toolResultOutput)
    return {
      role: "system",
      content: toolResultOutput,
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
}
