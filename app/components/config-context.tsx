'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface ConfigInterface {
  chatModel: string;
  setChatModel: (model: string) => void;
  completionModel: string;
  setCompletionModel: (model: string) => void;
  temperature: number;
  setTemperature: (temperature: number) => void;
  topK: number;
  setTopK: (topK: number) => void;
  store: string;
  setStore: (store: string) => void;
  embeddingModel: string;
  setEmbeddingModel: (embeddingModel: string) => void;
  includeDocs: boolean;
  setIncludeDocs: (includeDocs: boolean) => void;
  dimensions: number;
}

const notImplemented = () => {
  throw new Error('Not implemented');
};

export const DEFAULT_COMPLETION_MODEL = 'text-davinci-003';
export const DEFAULT_CHAT_MODEL = 'gpt-4';

const ConfigContext = createContext<ConfigInterface>({
  // Default values
  completionModel: '', // we default to chat models
  setCompletionModel: notImplemented,
  chatModel: DEFAULT_CHAT_MODEL,
  setChatModel: notImplemented,
  temperature: 0,
  setTemperature: notImplemented,
  topK: 3,
  setTopK: notImplemented,
  store: 'pinecone',
  setStore: notImplemented,
  embeddingModel: 'text-embedding-ada-002',
  setEmbeddingModel: notImplemented,
  includeDocs: true,
  setIncludeDocs: notImplemented,
  dimensions: 1536,
});

export const useConfig = () => {
  return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [completionModel, setCompletionModel] = useState<string>('');
  const [chatModel, setChatModel] = useState<string>(DEFAULT_CHAT_MODEL);
  const [temperature, setTemperature] = useState<number>(0);
  const [topK, setTopK] = useState<number>(3);
  const [store, setStore] = useState<string>('pinecone');
  const [embeddingModel, setEmbeddingModel] = useState<string>('text-embedding-ada-002');
  const [includeDocs, setIncludeDocs] = useState<boolean>(true);

  const context: ConfigInterface = {
    completionModel: completionModel,
    setCompletionModel: setCompletionModel,
    chatModel: chatModel,
    setChatModel: setChatModel,
    temperature,
    setTemperature,
    topK,
    setTopK,
    store,
    setStore,
    embeddingModel,
    setEmbeddingModel,
    includeDocs,
    setIncludeDocs,
    // This is fixed.
    dimensions: 1536,
  };

  return <ConfigContext.Provider value={context}>{children}</ConfigContext.Provider>;
};
