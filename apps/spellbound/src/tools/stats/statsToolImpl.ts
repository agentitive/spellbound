import { indexStats } from "../../api/pinecone"

import { StatsToolInterface } from "./StatsToolInterface"

export async function statsToolImpl(params: StatsToolInterface) {
  const stats = await indexStats()
  return JSON.stringify(stats, null, 2)
}
