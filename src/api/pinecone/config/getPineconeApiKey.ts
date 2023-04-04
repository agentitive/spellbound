/**
 * Get the Pinecone API key from the environment variable.
 */
function getPineconeApiKey() {
  const key = process.env.PINECONE_API_KEY

  if (!key) {
    throw new Error("PINECONE_API_KEY not set")
  }

  return key
}
