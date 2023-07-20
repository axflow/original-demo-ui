export type PineconeStore = {
  name: 'pinecone';
  indexName: string;
  indexDimensions: number;
  environment: string;
  namespace: string;
};

export type ChromaStore = {
  name: 'chroma';
  collection: string;
  url: string;
};

export type SupportedStore = PineconeStore | ChromaStore;
