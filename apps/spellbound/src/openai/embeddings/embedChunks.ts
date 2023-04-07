
import { Chunk } from "../../utils/chunking"
import { getEmbeddings } from "./getEmbeddings"

export const embedChunks = async (chunks: Chunk[]) => {
  const allTexts = chunks.map((chunk) => chunk.text)
  console.log("Embedding chunks...")
  for (let i = 0; i < allTexts.length; i += 1000) {
    console.log(`  ${i} - ${i + 1000} of ${allTexts.length}`)
    const texts = allTexts.slice(i, i + 1000)
    const embeddings = await getEmbeddings(texts)
    chunks.slice(i, i + 1000).forEach((chunk, j) => {
      chunk.embedding = embeddings[j]
    })
  }
}
