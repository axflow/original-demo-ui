export const runtime = 'edge'; // 'nodejs' is the default
import { queryCompletionStream } from 'lib/query';

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

// function sleep(time: number) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, time);
//   });
// }
//
// const encoder = new TextEncoder();

// async function* makeIterator() {
//   yield encoder.encode('<p>One</p>');
//   await sleep(1000);
//   yield encoder.encode('<p>Two</p>');
//   await sleep(1000);
//   yield encoder.encode('<p>Three</p>');
// }

export async function GET() {
  const query = 'What is the weather like in SF?';
  const result = await queryCompletionStream({
    query,
    model: 'text-davinci-003',
    store: 'pinecone',
    llmOnly: true,
    temperature: 0,
    maxTokens: 256,
    topK: 1,
  });
  const stream = iteratorToStream(result);

  return new Response(stream);
}
