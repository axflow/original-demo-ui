import { Ingestion, Wikipedia, TextSplitter, OpenAIEmbedder, TextDocument } from 'axgen';
import { getPineconeStore, getOpenAiKey } from './axgen-utils';

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

export const ingestFile = async (content: string, filename: string) => {
  const store = getPineconeStore();
  const ingestion = new Ingestion({
    store,
    source: new TextDocument({ content, url: `file://${filename}` }),
    splitter: new TextSplitter({}),
    embedder: new OpenAIEmbedder({ apiKey: getOpenAiKey() }),
  });

  await ingestion.run();

  return filename;
};
