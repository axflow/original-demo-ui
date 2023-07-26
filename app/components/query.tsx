'use client';
import { useState } from 'react';
import { useConfig } from '@/app/components/config-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { ContextDocument } from '@/lib/types';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import DocumentCard from '@/app/components/document-card';

const JSON_SEPARATOR_CODE_POINT = String.fromCharCode(parseInt('1d', 16));
const CONTENT_SEPARATOR_CODE_POINT = String.fromCharCode(parseInt('1e', 16));

export function QueryWidget() {
  const [response, setResponse] = useState<string>('');
  const [querying, setQuerying] = useState<boolean>(false);
  const [docs, setDocs] = useState<Array<ContextDocument>>([]);
  const { topK, temperature, completionModel, chatModel, includeDocs, store, maxTokens } =
    useConfig();

  const QuerySchema = z.object({
    prompt: z
      .string({
        required_error: 'Please write your question',
      })
      .min(10, { message: 'The minimum prompt length is 10 characters.' })
      .max(3000, { message: 'The maximum prompt length is 3000 characters.' }),
  });

  const queryForm = useForm<z.infer<typeof QuerySchema>>({
    resolver: zodResolver(QuerySchema),
  });

  async function onSubmit(data: z.infer<typeof QuerySchema>) {
    setQuerying(true);
    setResponse('');
    setDocs([]);

    const modelType = chatModel ? 'chat' : 'completion';
    const res = await fetch('/api/query/stream', {
      method: 'POST',
      body: JSON.stringify({
        modelType: modelType,
        question: data.prompt,
        llmOnly: !includeDocs,
        topK,
        temperature,
        model: modelType === 'chat' ? chatModel : completionModel,
        store,
        maxTokens,
      }),
    });

    if (!res?.body) {
      return;
    }

    const reader = res.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        const finishedChunks = new Uint8Array(
          ([] as number[]).concat(...chunks.map((chunk) => Array.from(chunk)))
        );
        const decodedData = new TextDecoder().decode(finishedChunks);
        const chainedDocuments = decodedData.split(CONTENT_SEPARATOR_CODE_POINT)[1];
        const documents = chainedDocuments.split(JSON_SEPARATOR_CODE_POINT);

        setDocs(documents.filter((doc) => doc).map((doc) => JSON.parse(doc)));
        break;
      }

      chunks.push(value);
      const concatenatedChunks = new Uint8Array(
        ([] as number[]).concat(...chunks.map((chunk) => Array.from(chunk)))
      );

      const decodedData = new TextDecoder().decode(concatenatedChunks);
      const text = decodedData.split(CONTENT_SEPARATOR_CODE_POINT)[0];

      setResponse(text);
    }

    setQuerying(false);
  }

  return (
    <div className="flex flex-col items-center">
      <section className="my-8 flex w-full flex-col items-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Ask a question
        </h1>
        <div className="w-3/4">
          <Form {...queryForm}>
            <form onSubmit={queryForm.handleSubmit(onSubmit)}>
              <FormField
                control={queryForm.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <div className="mt-4 flex flex-col gap-2">
                      <FormLabel className="min-w-fit">Question</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ask your data a question" {...field} rows={4} />
                      </FormControl>
                    </div>
                    {includeDocs && (
                      <FormDescription>
                        The system will fetch relevant document chunks, pass them to the query
                        context and return the LLM&rsquo;s response.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className=" flex items-center justify-center">
                <Button type="submit" className="mt-4" disabled={querying}>
                  {querying ? 'Querying...' : 'Query'}
                </Button>
              </div>
            </form>
          </Form>

          <Label>Response</Label>
          <Textarea defaultValue={response.trim()} rows={10} />
        </div>

        {docs && docs.length > 0 && (
          <div className="w-3/4 py-6">
            <Label className="mb-4">Retrieved Documents</Label>
            <div className={'grid gap-6 ' + `grid-cols-${docs.length > 1 ? '2' : '1'}`}>
              {docs.map((doc, idx) => (
                <DocumentCard key={doc.id} document={doc} idx={idx} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
