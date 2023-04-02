import * as https from "https"
import { ClientRequest, IncomingMessage } from "http"

type Callbacks = {
  onData: (chunk: string) => void
  onError?: (error: Error) => void
  onEnd?: () => void
}

type Message = { role: string; content: string }

type MessageCompletionChunk = {
  id: string
  object: "chat.completion.chunk"
  created: number
  model: string
  choices: {
    delta: { content: string }
    index: number
    finish_reason: null | string
  }[]
}

function httpRequest(options: https.RequestOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = ""

      res.on("data", (chunk) => {
        data += chunk
      })

      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(data)
        } else {
          reject(new Error(`Request failed. Status code: ${res.statusCode}`))
        }
      })
    })

    req.on("error", reject)
    req.end()
  })
}

export async function listModels(apiKey: string): Promise<string[]> {
  try {
    const options: https.RequestOptions = {
      hostname: "api.openai.com",
      path: "/v1/models",
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }

    const data = await httpRequest(options)
    const models: string[] = JSON.parse(data).data.map((x: any) => x.id)
    return models
  } catch (error) {
    console.error("Error fetching models:", error)
    return []
  }
}

function parseCompletionDataChunk(buffer: Buffer): string {
  const contentDelimiter = "\n\n"
  const jsonDataPrefix = "data: "

  const bufferString = buffer.toString("utf-8")
  const bufferChunks = bufferString.split(contentDelimiter)

  let contentOutput = ""

  for (const chunk of bufferChunks) {
    if (chunk.startsWith(jsonDataPrefix)) {
      const jsonString = chunk.slice(jsonDataPrefix.length)

      if (jsonString === "[DONE]") {
        continue
      }

      const jsonData: MessageCompletionChunk = JSON.parse(jsonString)

      for (const choice of jsonData.choices) {
        contentOutput += choice.delta.content ?? ""
      }
    } else {
      if (chunk) {
        console.error("Unexpected chunk:", chunk)
      }
    }
  }

  return contentOutput
}

export async function streamingCompletion(
  apiKey: string,
  model: string,
  messages: Message[],
  callbacks: Callbacks
): Promise<string> {
  const options: https.RequestOptions = {
    hostname: "api.openai.com",
    path: `/v1/chat/completions`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Transfer-Encoding": "chunked",
    },
  }

  let buffer = ""

  let _res: IncomingMessage

  const req = https.request(options, (res) => {
    _res = res

    res.on("data", (chunk) => {
      const completion = parseCompletionDataChunk(chunk)

      if (completion) {
        buffer += completion

        callbacks.onData(completion)
      }
    })

    res.on("error", (error) => {
      if (callbacks.onError) {
        callbacks.onError(new Error(`Data error: ${error}`))
      }
    })

    res.on("end", () => {
      if (callbacks.onEnd) {
        callbacks.onEnd()
      }
    })
  })

  req.on("error", (error) => {
    if (callbacks.onError) {
      callbacks.onError(new Error(`Request error: ${error}`))
    }
  })

  req.write(JSON.stringify({ model, messages, stream: true }))
  req.end()

  return new Promise((resolve, reject) => {
    req.on("close", () => {
      resolve("Request closed")
    })

    req.on("error", (error) => {
      reject(error)
    })

    _res.on("error", (error) => {
      reject(error)
    })

    _res.on("end", () => {
      resolve(buffer)
    })
  })
}

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.error("Missing OpenAI API key")
  process.exit(1)
}

;(async () => {
  const models = await listModels(apiKey)
  console.log("Available models:", models)

  const modelName = "gpt-4"
  const messages = [{ role: "user", content: "Hello" }]

  const req = streamingCompletion(apiKey, modelName, messages, {
    onData: (chunk) => {
      console.log(chunk)
    },
    onError: (error) => {
      console.error(error)
    },
    onEnd: () => {
      console.log("Request ended")
    },
  })
})()
