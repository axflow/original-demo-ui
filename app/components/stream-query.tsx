'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function StreamQueryBox() {
  const [response, setResponse] = useState<string>('');

  const handleSubmit = async () => {
    const res = await fetch('/api/query/stream');

    if (!res?.body) {
      return;
    }

    const reader = res.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      const concatenatedChunks = new Uint8Array(
        ([] as number[]).concat(...chunks.map((chunk) => Array.from(chunk)))
      );

      const decodedData = new TextDecoder().decode(concatenatedChunks);

      setResponse(decodedData);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-2xl font-extrabold">Streaming</h1>
      <Button onClick={handleSubmit}>Start</Button>
      <p className="border-1 m-4 w-32 rounded border border-border p-4">{response}</p>
    </div>
  );
}
