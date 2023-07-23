import { NextRequest, NextResponse } from 'next/server';
import { queryCompletion, queryChat } from '@/lib/query';

export async function POST(request: NextRequest) {
  const { modelType, question, llmOnly, topK, model, temperature, maxTokens, store } =
    await request.json();
  try {
    let response;
    switch (modelType) {
      case 'completion':
        response = await queryCompletion({
          query: question,
          model,
          store,
          llmOnly,
          topK,
          temperature,
          maxTokens,
        });
        break;
      case 'chat':
        response = await queryChat({
          query: question,
          model,
          llmOnly,
          topK,
          temperature,
          store,
          maxTokens,
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid model type' }, { status: 400 });
    }
    return NextResponse.json({ response }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;

    console.error(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
