import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/query';

export async function POST(request: NextRequest) {
  const { question, llmOnly, topK, model } = await request.json();
  // TODO pass temperature through
  try {
    const response = await query(question, model, llmOnly, topK);
    return NextResponse.json({ response }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;

    console.error(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
