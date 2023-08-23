import { Pinecone, PgVector } from 'axgen';
import { getEnvOrThrow } from './utils';

export const getPineconeStore = () => {
  return new Pinecone({
    index: getEnvOrThrow('PINECONE_INDEX'),
    namespace: getEnvOrThrow('PINECONE_NAMESPACE'),
    apiKey: getEnvOrThrow('PINECONE_API_KEY'),
    environment: getEnvOrThrow('PINECONE_ENVIRONMENT'),
  });
};

export const getPgVectorStore = () => {
  return new PgVector({
    dsn: 'postgresql://localhost/axilla-demo',
    tableName: 'vectors',
  });
};

export const getOpenAiKey = () => {
  return getEnvOrThrow('OPENAI_API_KEY');
};
