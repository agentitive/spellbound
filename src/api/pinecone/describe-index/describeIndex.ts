import { fetchData } from "../../generic/fetchData"
import { getPineconeEnvironment } from "../config/getPineconeEnvironment"
import { DescribeIndexResponse } from "./DescribeIndexResponse"

/**
 * Describes the metadata for the Pinecone index we're using for the Spellbound
 * extension. This is used to get the hostname for the Pinecone index.
 */
export async function describeIndex(): Promise<DescribeIndexResponse> {
  const options = {
    hostname: `controller.${getPineconeEnvironment()}.pinecone.io`,
    path: `/databases/${getPineconeIndex()}`,
    method: "GET",
    headers: {
      "Api-Key": getPineconeApiKey(),
    },
  }

  try {
    const data = await fetchData(options)
    const obj = JSON.parse(data)
    return obj
  } catch (error) {
    console.error(error)
    throw error
  }
}
