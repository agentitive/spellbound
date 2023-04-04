import { listModels } from "../api/openai"
import { getOpenAIKey } from "./getOpenAIKey"

export async function getModelList() {
  const key = getOpenAIKey()

  if (key) {
    const models = await listModels(key)

    return models
  }

  return []
}
