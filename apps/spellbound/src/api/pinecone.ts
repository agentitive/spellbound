import { Pinecone } from "@pinecone-database/pinecone"
import { getPineconeIndex } from "../environment/getPineconeIndex"
import { getPineconeKey } from "../environment/getPineconeKey"
import { embedChunks } from "./openai"
import {
  Chunk,
  IGNORED_EXTENSIONS,
  chunkFile,
  chunkFiles,
} from "../utils/chunking"
import { createUUID } from "../utils/uuid"
import { runGitCommand } from "../tools/git/utility/runGitCommand"
import { getCurrentWorkspaceFolder } from "../utils/getCurrentWorkspaceFolder"
import path, { join } from "path"

const createClient = async () => {
  const pinecone = new Pinecone({
    apiKey: getPineconeKey()!,
  })

  return pinecone
}

const getIndex = async () => {
  const pinecone = await createClient()
  const indexName = getPineconeIndex()
  return pinecone.Index(indexName!)
}

const convertChunk = (chunk: Chunk, metadata = {}) => ({
  id: createUUID(),
  values: chunk.embedding!,
  metadata: {
    ...metadata,
    filename: chunk.filename,
    start: chunk.start,
    end: chunk.end,
    text: chunk.text,
  },
})

const upsertChunks = async (chunks: Chunk[], namespace = "", metadata = {}) => {
  const index = await getIndex()
  const vectors = chunks.map(convertChunk, metadata)
  console.log(`Upserting chunks:`)
  for (let i = 0; i < vectors.length; i += 100) {
    console.log(`  ${i} - ${i + 100} of ${vectors.length}`)
    await index.upsert(vectors.slice(i, i + 100))
  }
}

export const upsertFile = async (
  filename: string,
  block_size: number,
  block_overlap: number,
  metadata: any,
  namespace = ""
) => {
  const chunks = chunkFile(filename, block_size, block_overlap)
  await embedChunks(chunks)
  await upsertChunks(chunks, namespace, metadata)
}

export const upsertFolder = async (
  folder: string,
  block_size: number,
  block_overlap: number,
  metadata: any,
  namespace = ""
) => {
  const files = (await runGitCommand("ls-files"))
    .split("\n")
    .slice(1, -1)
    .filter(
      (x) =>
        !IGNORED_EXTENSIONS.includes(path.extname(x)) &&
        !x.endsWith("package-lock.json")
    )

  const workspace = getCurrentWorkspaceFolder()
  const absoluteFiles = files.map((f) => join(workspace, f))

  const chunks = chunkFiles(absoluteFiles, block_size, block_overlap)
  await embedChunks(chunks)
  await upsertChunks(chunks, namespace, metadata)
}

export const query = async (
  vector: number[],
  topK: number,
  filter = undefined
) => {
  const client = await createClient()
  const indexName = getPineconeIndex()
  const index = client.Index(indexName!)
  const queryRequest = {
    vector,
    topK,
    filter,
    includeMetadata: true,
    includeValues: false,
  }

  return index.query(queryRequest)
}

export const clearNamespace = async () => {
  const client = await createClient()
  const indexName = getPineconeIndex()
  // const index = client.index(indexName!)

  // try {
  //   await index.deleteAll()
  // } catch (error) {
  //   console.error(error)
  // }
}

// run DescribeIndexStats
export const indexStats = async () => {
  const index = await getIndex()
  return index.describeIndexStats()
}
