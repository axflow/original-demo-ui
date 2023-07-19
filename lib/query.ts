import {
  BasicPrompt,
  Completion,
  RAG,
  OpenAIEmbedder,
  Retriever,
  PromptWithContext,
  OpenAICompletion,
  QUESTION_WITHOUT_CONTEXT,
  QUESTION_WITH_CONTEXT,
} from 'axgen';
import { getPineconeStore, getOpenAiKey } from './axgen-utils';

export async function query(question: string, model: string, llmOnly: boolean, topK: number) {
  return llmOnly ? completion(question, model) : rag(question, model, topK);
}

export const completion = async (query: string, model: string) => {
  const completion = new Completion({
    model: new OpenAICompletion({ model: model, max_tokens: 256 }),
    prompt: new BasicPrompt({ template: QUESTION_WITHOUT_CONTEXT }),
  });

  return completion.run(query);
};

export const rag = async (question: string, model: string, topK: number) => {
  const pinecone = getPineconeStore();

  const rag = new RAG({
    model: new OpenAICompletion({
      model: model,
      max_tokens: 256,
      apiKey: getOpenAiKey(),
    }),
    prompt: new PromptWithContext({ template: QUESTION_WITH_CONTEXT }),
    embedder: new OpenAIEmbedder({ apiKey: getOpenAiKey() }),
    // Parameterize me!
    retriever: new Retriever({ store: pinecone, topK }),
  });

  return rag.run(question);
};
