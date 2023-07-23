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
import { getOpenAiKey } from './axgen-utils';
import { getStore } from '@/lib/ingest';

type QueryOptions = {
  query: string;
  model: string;
  llmOnly: boolean;
  topK: number;
  temperature: number;
  maxTokens: number;
  store: string;
  // TODO advanced filtering with DSL supporting operators $and, $or, $lt, $gt, $eq, $neq, $in, $nin
  // For now, hardcode to matching the 'term' field of the metadata
  filterTerm?: string;
};

export async function queryChat(opts: QueryOptions) {
  return opts.llmOnly ? chat(opts) : ragChat(opts);
}

export const chat = async (opts: QueryOptions) => {
  const completion = new ChatCompletion({
    model: new OpenAIChatCompletion({
      model: opts.model,
      max_tokens: opts.maxTokens,
      temperature: opts.temperature,
    }),
    prompt: new BasicPromptMessage({ template: QUESTION_WITHOUT_CONTEXT }),
  });

  return completion.run(opts.query);
};

export const ragChat = async (opts: QueryOptions) => {
  const store = getStore(opts.store);
  const rag = new RAGChat({
    model: new OpenAIChatCompletion({
      model: opts.model,
      max_tokens: opts.maxTokens,
      temperature: opts.temperature,
    }),
    prompt: new PromptMessageWithContext({ template: QUESTION_WITH_CONTEXT }),
    retriever: new Retriever({ store, topK: opts.topK }),
    embedder: new OpenAIEmbedder(),
  });

  return rag.run(opts.query);
};

export async function queryCompletion(opts: QueryOptions) {
  return opts.llmOnly ? completion(opts) : rag(opts);
}

export const completion = async (opts: QueryOptions) => {
  const completion = new Completion({
    model: new OpenAICompletion({
      model: opts.model,
      max_tokens: opts.maxTokens,
      temperature: opts.temperature,
    }),
    prompt: new BasicPrompt({ template: QUESTION_WITHOUT_CONTEXT }),
  });

  return completion.run(opts.query);
};

export const rag = async (opts: QueryOptions) => {
  const store = getStore(opts.store);

  const rag = new RAG({
    model: new OpenAICompletion({
      model: opts.model,
      max_tokens: opts.maxTokens,
      apiKey: getOpenAiKey(),
      temperature: opts.temperature,
    }),
    prompt: new PromptWithContext({ template: QUESTION_WITH_CONTEXT }),
    embedder: new OpenAIEmbedder({ apiKey: getOpenAiKey() }),
    // Parameterize me!
    retriever: new Retriever({ store, topK: opts.topK }),
  });

  return rag.run(opts.query);
};
