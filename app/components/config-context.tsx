'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface ConfigInterface {
  model: string;
  setModel: (model: string) => void;
  temperature: number;
  setTemperature: (temperature: number) => void;
  topK: number;
  setTopK: (topK: number) => void;
  store: string;
  setStore: (store: string) => void;
}

const notImplemented = () => {
  throw new Error(
    'You need to wrap your application with the <PrivyProvider> initialized with your app id.'
  );
};

const ConfigContext = createContext<ConfigInterface>({
  // Default values
  model: 'text-davinci-003',
  setModel: notImplemented,
  temperature: 0,
  setTemperature: notImplemented,
  topK: 3,
  setTopK: notImplemented,
  store: 'pinecone',
  setStore: notImplemented,
});

export const useConfig = () => {
  return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [model, setModel] = useState<string>('text-davinci-003');
  const [temperature, setTemperature] = useState<number>(0);
  const [topK, setTopK] = useState<number>(3);
  const [store, setStore] = useState<string>('pinecone');

  const context: ConfigInterface = {
    model,
    setModel,
    temperature,
    setTemperature,
    topK,
    setTopK,
    store,
    setStore,
  };

  return <ConfigContext.Provider value={context}>{children}</ConfigContext.Provider>;
};
