import {
  BasicPrompt,
  Completion,
  ChatCompletion,
  OpenAIChatCompletion,
  BasicPromptMessage,
  RAG,
  RAGChat,
  PromptMessageWithContext,
  OpenAIEmbedder,
  Retriever,
  PromptWithContext,
  OpenAICompletion,
  QUESTION_WITHOUT_CONTEXT,
  QUESTION_WITH_CONTEXT,
} from 'axgen';
import { getPineconeStore, getOpenAiKey } from './axgen-utils';

type QueryOptions = {
  query: string;
  model: string;
  llmOnly: boolean;
  topK: number;
  temperature: number;
  // TODO advanced filtering with DSL supporting operators $and, $or, $lt, $gt, $eq, $neq, $in, $nin
  // For now, hardcode to matching the 'term' field of the metadata
  filterTerm?: string;
};

export async function queryChat(opts: QueryOptions) {
  return opts.llmOnly
    ? chat(opts.query, opts.model, opts.temperature)
    : ragChat(opts.query, opts.model, opts.topK, opts.temperature);
}

export const chat = async (query: string, model: string, temperature: number) => {
  const completion = new ChatCompletion({
    model: new OpenAIChatCompletion({ model: model, max_tokens: 1000, temperature }),
    prompt: new BasicPromptMessage({ template: QUESTION_WITHOUT_CONTEXT }),
  });

  return completion.run(query);
};

export const ragChat = async (
  question: string,
  model: string,
  topK: number,
  temperature: number
) => {
  const pinecone = getPineconeStore();
  const rag = new RAGChat({
    model: new OpenAIChatCompletion({ model: model, max_tokens: 1000, temperature }),
    prompt: new PromptMessageWithContext({ template: QUESTION_WITH_CONTEXT }),
    retriever: new Retriever({ store: pinecone, topK: topK }),
    embedder: new OpenAIEmbedder(),
  });

  return rag.run(question);
};

export async function queryCompletion(opts: QueryOptions) {
  return opts.llmOnly
    ? completion(opts.query, opts.model, opts.temperature)
    : rag(opts.query, opts.model, opts.topK, opts.temperature);
}

export const completion = async (query: string, model: string, temperature: number) => {
  const completion = new Completion({
    model: new OpenAICompletion({ model: model, max_tokens: 256, temperature }),
    prompt: new BasicPrompt({ template: QUESTION_WITHOUT_CONTEXT }),
  });

  return completion.run(query);
};

export const rag = async (question: string, model: string, topK: number, temperature: number) => {
  const pinecone = getPineconeStore();

  const rag = new RAG({
    model: new OpenAICompletion({
      model,
      max_tokens: 256,
      apiKey: getOpenAiKey(),
      temperature,
    }),
    prompt: new PromptWithContext({ template: QUESTION_WITH_CONTEXT }),
    embedder: new OpenAIEmbedder({ apiKey: getOpenAiKey() }),
    // Parameterize me!
    retriever: new Retriever({ store: pinecone, topK }),
  });

  return rag.run(question);
};
