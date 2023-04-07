import { Message } from "spellbound-shared"
import { streamInference } from "../api/openai"

export class InferenceJob {
  private aborted = false
  buffer: string

  constructor(
    protected messages: Message[], 
    protected onStart: () => Promise<void>,
    protected onData: (output: string) => Promise<void>, 
    protected onEnd: (result: string) => Promise<void>
  ) {
    this.buffer = ''
    this.aborted = false
  }

  abort(): void {
    this.aborted = true
  }

  public async start(): Promise<void> {
    this.buffer = ''
    this.aborted = false

    this.onStart()

    await streamInference(this.messages, {
      onData: async (output: string) => {
        if (!this.aborted) {
          this.buffer += output
          await this.onData(output)
        }
      },
      onEnd: async () => {
        if (!this.aborted) {
          await this.onEnd(this.buffer)
        }
      },
    })
  }
}

export class InferenceService {
  private currentJob: InferenceJob | null = null

  infer(
    messages: Message[],
    onStart: () => Promise<void>,
    onData: (output: string) => Promise<void>,
    onEnd: (result: string) => Promise<void>
  ) {
    this.abort()
    this.currentJob = new InferenceJob(messages, onStart, onData, onEnd)
    this.currentJob.start()
  }

  abort(): void {
    if (this.currentJob) {
      this.currentJob.abort()
      this.currentJob = null
    }
  }

}