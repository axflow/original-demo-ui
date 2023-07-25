import { NextRequest, NextResponse } from 'next/server';
import { queryChatStream, queryCompletionStream } from 'lib/query';
// Separators recommended from
// https://stackoverflow.com/questions/6319551/whats-the-best-separator-delimiter-characters-for-a-plaintext-db-file
const JSON_STREAM_SEPARATOR = Uint8Array.from([0x1d]);
const CONTENT_STREAM_SEPARATOR = Uint8Array.from([0x1e]);

type ChatResponse = {
  choices: Array<{
    delta: {
      content: string;
    };
  }>;
};

type InfoContext = {
  context?: Array<object>;
};

function iterableToStream(iterable: AsyncIterable<string | ChatResponse>, info: InfoContext) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async pull(controller) {
      for await (const value of iterable) {
        const chunk = typeof value === 'string' ? value : value.choices[0].delta.content;
        controller.enqueue(encoder.encode(chunk));
      }

      controller.enqueue(CONTENT_STREAM_SEPARATOR);
      const documents = info.context;
      if (documents) {
        for (const document of documents) {
          controller.enqueue(encoder.encode(JSON.stringify(document)));
          controller.enqueue(JSON_STREAM_SEPARATOR);
        }
      }

      controller.close();
    },
  });
}

type RequestBody = {
  question: string;
  model: string;
  store: string;
  llmOnly: boolean;
  temperature: number;
  maxTokens: number;
  topK: number;
};

export async function handleCompletion(body: RequestBody) {
  const { question, llmOnly, topK, model, temperature, maxTokens, store } = body;
  const { result: iterable, info } = await queryCompletionStream({
    query: question,
    model: model,
    store,
    llmOnly,
    temperature,
    maxTokens,
    topK,
  });
  const stream = iterableToStream(iterable, info);
  return new Response(stream);
}

export async function handleChat(body: RequestBody) {
  const { question, llmOnly, topK, model, temperature, maxTokens, store } = body;
  const { result: iterable, info } = await queryChatStream({
    query: question,
    model: model,
    store,
    llmOnly,
    temperature,
    maxTokens,
    topK,
  });
  const stream = iterableToStream(iterable, info);
  return new Response(stream);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  switch (body.modelType) {
    case 'completion':
      return handleCompletion(body);

    case 'chat':
      return handleChat(body);

    default:
      return NextResponse.json({ error: 'Invalid model type' }, { status: 400 });
  }
}
