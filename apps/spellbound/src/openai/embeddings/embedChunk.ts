
import { Chunk } from "../../utils/chunking"
import { getEmbedding } from "./getEmbedding"

export const embedChunk = async (chunk: Chunk) => {
  chunk.embedding = await getEmbedding(chunk.text)
}
