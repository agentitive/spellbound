import fetch from "node-fetch"
import { getOpenAIKey } from "../../environment/getOpenAIKey"
import { EmbeddingResponse } from "./types"

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
