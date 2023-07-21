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

const ConfigContext = createContext<ConfigInterface>({
  // Default values
  completionModel: 'text-davinci-003',
  setCompletionModel: notImplemented,
  chatModel: 'GPT-4',
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
  const [completionModel, setCompletionModel] = useState<string>('text-davinci-003');
  const [chatModel, setChatModel] = useState<string>('GPT-4');
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
