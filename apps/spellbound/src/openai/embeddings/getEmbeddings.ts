import fetch from "node-fetch"
import { getOpenAIKey } from "../../environment/getOpenAIKey"
import { EmbeddingResponse } from "./types"

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
