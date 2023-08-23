export type PineconeStore = {
  name: 'pinecone';
  indexName: string;
  indexDimensions: number;
  environment: string;
  namespace: string;
};

export type PgVectorStore = {
  name: 'pgvector';
  tableName: string;
  dsn: string;
};

export type SupportedStore = PineconeStore | PgVectorStore;
