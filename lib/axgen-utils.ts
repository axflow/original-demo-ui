import { Pinecone, Chroma } from 'axgen';
import { getEnvOrThrow } from './utils';

export const getPineconeStore = () => {
  return new Pinecone({
    index: getEnvOrThrow('PINECONE_INDEX'),
    namespace: getEnvOrThrow('PINECONE_NAMESPACE'),
    apiKey: getEnvOrThrow('PINECONE_API_KEY'),
    environment: getEnvOrThrow('PINECONE_ENVIRONMENT'),
  });
};

export const getChromaStore = () => {
  return new Chroma({
    path: getEnvOrThrow('CHROMA_PATH'),
    collection: getEnvOrThrow('CHROMA_COLLECTION'),
  });
};

export const getOpenAiKey = () => {
  return getEnvOrThrow('OPENAI_API_KEY');
};
