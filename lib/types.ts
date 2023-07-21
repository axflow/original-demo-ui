export type ContextDocument = {
  id: string;
  chunk: {
    text: string;
    url: string;
  };
  similarity?: number;
};
