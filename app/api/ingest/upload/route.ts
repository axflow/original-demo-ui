import { NextRequest, NextResponse } from 'next/server';
import { ingestFile } from '@/lib/ingest';

// Parse the uploaded file into chunks.
// Join them, and ingest them into the vector store.
export async function POST(request: NextRequest) {
  const stream = request.body!;
  let decoder = new TextDecoder('utf-8');
  let reader = stream.getReader();
  let chunks: string[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      if (value) {
        chunks.push(decoder.decode(value));
      }
    }
  } finally {
    reader.releaseLock();
  }

  const content = chunks.join('');
  if (!content) {
    return NextResponse.json({ error: 'Error reading file' }, { status: 400 });
  }

  try {
    const fileContent = removeBoundaries(content);
    await ingestFile(content, 'fake/url/for/now');
    return NextResponse.json({ content: fileContent }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error ingesting file' }, { status: 400 });
  }
}

const removeBoundaries = (data: string): string => {
  // Split the body into parts
  const boundary = data.match(/-----+\w+/)![0];
  if (!boundary) {
    throw new Error('Error reading file');
  }
  const parts = data.split(boundary).slice(1, -1);

  // Find the part with the file
  const filePart = parts.find((part) => part.includes('form-data; name="file"'));
  if (!filePart) {
    throw new Error('Error reading file');
  }

  // Remove the headers from the file part
  const fileContent = filePart.split('\r\n\r\n')[1].trim();

  return fileContent;
};
