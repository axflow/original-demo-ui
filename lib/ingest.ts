import { Ingestion, Wikipedia, TextSplitter, OpenAIEmbedder, TextDocument } from 'axgen';
import { getPgVectorStore, getPineconeStore, getOpenAiKey } from './axgen-utils';

export const getStore = (store: string) => {
  switch (store) {
    case 'pinecone':
      return getPineconeStore();
    case 'pgvector':
      return getPgVectorStore();
    default:
      throw new Error(`Unknown store ${store}`);
  }
};

export const ingestWikipedia = async (term: string, storeName: string) => {
  const store = getStore(storeName);

  const ingestion = new Ingestion({
    store,
    source: new Wikipedia({ term }),
    splitter: new TextSplitter({}),
    embedder: new OpenAIEmbedder({ apiKey: getOpenAiKey() }),
  });

  await ingestion.run();
};

export const ingestFile = async (
  storeName: 'pinecone' | 'pgvector',
  content: string,
  filename: string
) => {
  const store = getStore(storeName);
  const ingestion = new Ingestion({
    store,
    source: new TextDocument({ content, url: `file://${filename}` }),
    splitter: new TextSplitter({}),
    embedder: new OpenAIEmbedder({ apiKey: getOpenAiKey() }),
  });

  await ingestion.run();

  return filename;
};
