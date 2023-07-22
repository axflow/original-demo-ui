import { NextRequest, NextResponse } from 'next/server';
import { ingestWikipedia } from '@/lib/ingest';

export async function POST(request: NextRequest) {
  const { term, store } = await request.json();
  try {
    await ingestWikipedia(term, store);
  } catch (error: unknown) {
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;

    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ term }, { status: 200 });
}
