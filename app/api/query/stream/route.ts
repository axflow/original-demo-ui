import { queryCompletionStream } from 'lib/query';

function iterableToStream(iterable: AsyncIterable<string>) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async pull(controller) {
      for await (const value of iterable) {
        controller.enqueue(encoder.encode(value));
      }
      controller.close();
    },
  });
}

// function sleep(time: number) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, time);
//   });
// }

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

  const { result: iterable } = queryCompletionStream({
    query,
    model: 'text-davinci-003',
    store: 'pinecone',
    llmOnly: false,
    temperature: 0,
    maxTokens: 256,
    topK: 1,
  });

  const stream = iterableToStream(iterable);

  return new Response(stream);
}
