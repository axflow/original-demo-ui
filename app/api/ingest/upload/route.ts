import { NextRequest, NextResponse } from 'next/server';
import { ingestFile } from '@/lib/ingest';

// Parse the uploaded file into chunks.
// Join them, and ingest them into the vector store.
// TODO support more keys than just the file. Consider using formidable or multer
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');
  const storeName = formData.get('store');

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
    await ingestFile(storeName as 'pinecone' | 'chroma', content, 'fake/url/for/now');
    return NextResponse.json({ content, store: storeName }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error ingesting file' }, { status: 400 });
  }
}
