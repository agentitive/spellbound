export type Embedding = {
  embedding: number[];
  index: number;
  object: "embedding";
}

export type EmbeddingResponse = {
  data: Embedding[];
  model: string;
  object: "list";
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}
