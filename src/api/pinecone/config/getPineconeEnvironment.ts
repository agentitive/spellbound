/**
 * Returns the Pinecone environment. This is a 'region code', e.g.
 * "us-west4-gcp", a description of the region where the Pinecone index is
 * located.
 *
 * @returns The Pinecone environment.
 */
export function getPineconeEnvironment() {
  const env = process.env.PINECONE_ENVIRONMENT

  if (!env) {
    throw new Error("PINECONE_ENVIRONMENT not set")
  }

  return env
}
