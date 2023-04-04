import { getEmbedding } from "../../api/openai"
import { query } from "../../api/pinecone"

import { SearchToolInterface } from "./SearchToolInterface"
import { makeRelative } from "../../utils/paths"
import { ScoredVector } from "@pinecone-database/pinecone"

type Score = { max: number; avg: number }

const byKey = (scores: Record<string, Score>, key: keyof Score) => {
  return Object.keys(scores).sort((a, b) => {
    const scoreA = scores[a]
    const scoreB = scores[b]
    return scoreB[key] - scoreA[key]
  })
}

const calculateScores = (matches: ScoredVector[]) => {
  const scores: Record<string, { max: number; avg: number }> = {}

  for (const result of matches || []) {
    const { filename } = result.metadata as any
    const score = scores[filename] || { max: 0, avg: 0 }
    score.max = Math.max(score.max, result.score || 0)
    score.avg += result.score || 0
    scores[filename] = score
  }

  return scores
}

export async function searchToolImpl(params: SearchToolInterface) {
  const embedding = await getEmbedding(params.topic)
  const results = await query(embedding, 5, undefined, "code")

  const scores = calculateScores(results.matches || [])

  const byScore = byKey(scores, "max")
  const byAverage = byKey(scores, "avg")

  const topScorePath = makeRelative(byScore[0])
  const topAveragePath = makeRelative(byAverage[0])

  let response = `Semantic search results:
  Top score: ${topScorePath}
  Top average: ${topAveragePath}`

  return response
}
