/**
 * Get the Pinecone index name from the environment variable.
 *
 * @returns The Pinecone index name.
 */
function getPineconeIndex() {
  const index = process.env.PINECONE_INDEX ?? "spellbound"

  return index
}
