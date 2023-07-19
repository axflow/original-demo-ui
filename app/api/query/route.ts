import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/query';

export async function POST(request: NextRequest) {
  const { question, llmOnly } = await request.json();
  // TODO parameterize these!
  const topK = 3;
  const model = 'text-davinci-003';
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
