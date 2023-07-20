import { Ingestion, Wikipedia, TextSplitter, OpenAIEmbedder, TextDocument } from 'axgen';
import { getChromaStore, getPineconeStore, getOpenAiKey } from './axgen-utils';

const getStore = (store: 'pinecone' | 'chroma') => {
  switch (store) {
    case 'pinecone':
      return getPineconeStore();
    case 'chroma':
      return getChromaStore();
  }
};
export const ingestWikipedia = async (term: string) => {
  const store = getPineconeStore();
  const ingestion = new Ingestion({
    store,
    source: new Wikipedia({ term }),
    splitter: new TextSplitter({}),
    embedder: new OpenAIEmbedder({ apiKey: getOpenAiKey() }),
  });

  await ingestion.run();

  return term;
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
