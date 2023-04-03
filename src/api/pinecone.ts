import { PineconeClient } from "@pinecone-database/pinecone"
import { getPineconeIndex } from "../environment/getPineconeIndex"
import { getPineconeEnvironment } from "../environment/getPineconeEnvironment"
import { getPineconeKey } from "../environment/getPineconeKey"
import { embedChunks } from "./openai"
import { Chunk, chunkFile, chunkFolder } from "../utils/chunking"
import { createUUID } from "../utils/uuid"


const createClient = async () => {
    const pinecone = new PineconeClient()

    await pinecone.init({
        environment: getPineconeEnvironment()!,
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
    const upsertRequest = {
        vectors,
        namespace,
    }
    await index.upsert({ upsertRequest })
}

export const upsertFile = async (filename: string, block_size: number, block_overlap: number, metadata: any, namespace = "") => {
    const chunks = chunkFile(filename, block_size, block_overlap)
    await embedChunks(chunks)
    await upsertChunks(chunks, namespace, metadata)
}


export const upsertFolder = async (folder: string, block_size: number, block_overlap: number, metadata: any, namespace = "") => {
    const chunks = chunkFolder(folder, block_size, block_overlap)
    await embedChunks(chunks)
    await upsertChunks(chunks, namespace, metadata)
}

export const query = async (vector: number[], topK: number, filter = undefined, namespace = "") => {
    const client = await createClient()
    const indexName = getPineconeIndex()
    const index = client.Index(indexName!)
    const queryRequest = {
        vector,
        topK,
        filter,
        namespace,
        includeMetadata: true,
        includeValues: false,
    }

    return index.query({ queryRequest })
}

export const clearNamespace = async (namespace = "") => {
    const client = await createClient()
    const indexName = getPineconeIndex()
    const index = client.Index(indexName!)
    return index.delete1({ deleteAll : true, namespace })
}