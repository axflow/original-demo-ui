import { NextRequest, NextResponse } from 'next/server';
import { ingestFile } from '@/lib/ingest';

/**
 * POST /api/ingest/upload
 * Uploads a file, chunks it  to the specified store
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');
  const storeName = formData.get('store');
  const filename = formData.get('filename');
  console.log(filename);

  if (['pinecone', 'chroma'].includes(storeName as string) === false) {
    return NextResponse.json({ error: 'Invalid store name' }, { status: 400 });
  }

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Error reading file' }, { status: 400 });
  }

  // Convert file to Buffer
  const chunks: Buffer[] = [];
  for await (const chunk of file.stream()) {
    chunks.push(chunk as Buffer);
  }
  const fileContentBuffer = Buffer.concat(chunks);

  try {
    const content = fileContentBuffer.toString();
    await ingestFile(storeName as 'pinecone' | 'chroma', content, `file://${filename}`);
    return NextResponse.json({ content, store: storeName }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error ingesting file' }, { status: 400 });
  }
}
