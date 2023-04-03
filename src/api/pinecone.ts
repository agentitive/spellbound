import { PineconeClient } from "@pinecone-database/pinecone"
import { getPineconeIndex } from "../environment/getPineconeIndex"

const createUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

const createClient = async () => {
    const pinecone = new PineconeClient()

    await pinecone.init({
        environment: "YOUR_ENVIRONMENT",
        apiKey: "YOUR_API_KEY",
    })

    return pinecone
}

const upsert = async (values: number[], metadata: any, namespace = "") => {
    const id = createUUID()
    const pinecone = await createClient()
    const indexName = getPineconeIndex()
    const index = pinecone.Index(indexName!)
    const upsertRequest = {
        vectors: [{
            id,
            values,
            metadata
        }],
        namespace,
    }

    return index.upsert({ upsertRequest })
}

// chunk(file, block_size, block_overlap) splits a file into chunks of size block_size, with block_overlap overlap between chunks.
// The last chunk may be smaller than block_size.
const chunk = (file: string, block_size: number, block_overlap: number) => {
    const chunks = []
    let start = 0
    let end = block_size
    let overlap = 0

    while (start < file.length) {
        if (end > file.length) {
            end = file.length
        }

        chunks.push(file.substring(start, end))

        start = end - overlap // set start to the end of the previous chunk, minus the overlap
        end = start + block_size // set end to the end of the new chunk
    }

    return chunks
}

// upsettFile takes a file and splits it into chunks of size block_size, with block_overlap overlap between chunks.
export const upsertFile = async (file: string, block_size: number, block_overlap: number, metadata: any, namespace = "") => {
    const chunks = chunk(file, block_size, block_overlap)

    for (let i = 0; i < chunks.length; i++) {
        const values = chunks[i].split("").map((c) => c.charCodeAt(0))
        const _metadata = {
            ...metadata,
            filename: file,
            chunk: i,
        }
        await upsert(values, _metadata, namespace)
    }
}

// query takes a query vector and returns the top k results.
const query = async (queryVector: number[], topK: number, filter = {}, namespace = "") => {
    const client = await createClient()
    const indexName = getPineconeIndex()
    const index = client.Index(indexName!)
    const queryRequest = {
        queryVector,
        topK,
        filter,
        namespace,
    }

    return index.query({ queryRequest })
}
