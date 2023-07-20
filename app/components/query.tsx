'use client';
import { useState } from 'react';
import { useConfig } from '@/app/components/config-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { toast } from '@/components/ui/use-toast';

export function QueryWidget() {
  const [response, setResponse] = useState<string>('');
  const [querying, setQuerying] = useState<boolean>(false);
  const { topK, temperature, model, includeDocs } = useConfig();

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
    const res = await fetch('/api/query', {
      method: 'POST',
      body: JSON.stringify({
        question: data.prompt,
        llmOnly: !includeDocs,
        topK,
        temperature,
        model,
      }),
    });
    const json = await res.json();
    if (json.error) {
      toast({
        variant: 'destructive',
        title: 'Error ingesting',
        description: <p>{json.error}</p>,
      });
    } else {
      // TODO make this streaming
      setResponse(json.response);
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
                    <FormDescription>
                      The system will fetch relevant document chunks, pass them to the query context
                      and return the LLM&rsquo;s response.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 flex items-center justify-center">
                <Button type="submit" className="mt-4" disabled={querying}>
                  {querying ? 'Querying...' : 'Query'}
                </Button>
              </div>
            </form>
          </Form>

          <Label>Response</Label>
          <Textarea defaultValue={response.trim()} rows={10} />
        </div>
      </section>
    </div>
  );
}
