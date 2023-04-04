import * as https from "https"
import { getOpenAIKey } from "../environment/getOpenAIKey"
import { getCurrentModel } from "../environment/getCurrentModel"
import fetch from "node-fetch"
import { Chunk } from "../utils/chunking"
import { Message } from "spellbound-shared"

type Callbacks = {
  onData: (chunk: string) => void
  onError?: (error: Error) => void
  onEnd?: () => void
}

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

export async function streamInference(
  messages: Message[],
  callbacks: Callbacks
): Promise<string | undefined> {
  const apiKey = getOpenAIKey()

  const model = await getCurrentModel()

  if (!apiKey || !model) {
    return
  }

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

  let _resolve: (value: string | PromiseLike<string>) => void
  let _reject: (reason?: any) => void

  const req = https.request(options, (res) => {
    res.setTimeout(2000)

    res.on("timeout", () => {
      const error = new Error("Timeout: Request took too long to respond.")
      req.destroy(error)
      if (callbacks.onError) {
        callbacks.onError(error)
      }
      _reject(error)
    })

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
      _reject(error)
    })

    res.on("end", () => {
      if (callbacks.onEnd) {
        callbacks.onEnd()
      }
      _resolve(buffer)
    })
  })

  req.on("error", (error) => {
    if (callbacks.onError) {
      callbacks.onError(new Error(`Request error: ${error}`))
    }
    _reject(error)
  })

  req.write(JSON.stringify({ model, messages, stream: true }))
  req.end()

  return new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
}

export type Embedding = {
  embedding: number[]
  index: number
  object: "embedding"
}

export type EmbeddingResponse = {
  data: Embedding[]
  model: string
  object: "list"
  usage: {
    prompt_tokens: number
    total_tokens: number
  }
}

export const getEmbedding = async (text: string): Promise<number[]> => {
  const resp = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getOpenAIKey()}`,
    },
    body: JSON.stringify({
      input: text,
      model: "text-embedding-ada-002",
    }),
  })

  const data = (await resp.json()) as EmbeddingResponse
  
  return data.data[0].embedding
}

export const getEmbeddings = async (texts: string[]): Promise<number[][]> => {
  const resp = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getOpenAIKey()}`,
    },
    body: JSON.stringify({
      input: texts,
      model: "text-embedding-ada-002",
    }),
  })
  
  const data = (await resp.json()) as EmbeddingResponse

  if (!data.data) {
    return []
  }

  return data.data.map((x) => x.embedding)
}

export const embedChunk = async (chunk: Chunk) => {
  chunk.embedding = await getEmbedding(chunk.text)
}

export const embedChunks = async (chunks: Chunk[]) => {
  const allTexts = chunks.map((chunk) => chunk.text)
  console.log(`Embedding chunks...`)
  for (let i = 0; i < allTexts.length; i += 1000) {
    console.log(`  ${i} - ${i + 1000} of ${allTexts.length}`)
    const texts = allTexts.slice(i, i + 1000)
    const embeddings = await getEmbeddings(texts)
    chunks.slice(i, i + 1000).forEach((chunk, j) => {
      chunk.embedding = embeddings[j]
    })
  }
}
