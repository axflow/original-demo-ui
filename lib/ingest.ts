import { Ingestion, Wikipedia, TextSplitter, OpenAIEmbedder, TextDocument } from 'axgen';
import { getChromaStore, getPineconeStore, getOpenAiKey } from './axgen-utils';

const getStore = (store: string) => {
  switch (store) {
    case 'pinecone':
      return getPineconeStore();
    case 'chroma':
      return getChromaStore();
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
  storeName: 'pinecone' | 'chroma',
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
