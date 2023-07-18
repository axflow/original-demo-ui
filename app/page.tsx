'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { IngestWikipedia } from '@/app/components/ingest-wikipedia';
import { IngestDocumentUpload } from '@/app/components/ingest-upload';

function IngestTab() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    router.push(pathname + '?tab=ingest');
  }, [router, pathname]);

  return (
    <div className="flex flex-col items-center">
      <section className="my-8 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Ingest from wikipedia
        </h1>
        <IngestWikipedia />
      </section>

      <div className="my-16 flex w-1/2 items-center justify-center gap-2">
        <Separator />
        <p>or</p>
        <Separator />
      </div>

      <section className="my-8 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Upload a file
        </h1>
        <IngestDocumentUpload />
      </section>
    </div>
  );
}

function QueryTab() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    router.push(pathname + '?tab=query');
  }, [router, pathname]);

  const [response, setResponse] = useState<string>('');

  const QuerySchema = z.object({
    prompt: z
      .string({
        required_error: 'Please write your question',
      })
      .min(10, { message: 'The minimum prompt length is 10 characters.' })
      .max(3000, { message: 'The maximum prompt length is 3000 characters.' }),
    filter: z.string().optional(),
  });

  const queryForm = useForm<z.infer<typeof QuerySchema>>({
    resolver: zodResolver(QuerySchema),
  });

  function onSubmit(data: z.infer<typeof QuerySchema>) {
    toast({
      title: 'Query',
      description: <p>{data.prompt}</p>,
    });
    setResponse('The response would appear here...');
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
                        <Textarea placeholder="Ask your data a question" {...field} />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Ask a question, the data uploaded will be used to answer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={queryForm.control}
                name="filter"
                render={({ field }) => (
                  <FormItem>
                    <div className="mt-4 flex flex-col gap-2">
                      <FormLabel className="min-w-fit">Filter term</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Filter a document name (like 'San Francisco')"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Only fetch documents with a specific wikipedia term.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 flex items-center justify-center">
                <Button type="submit" className="mt-4">
                  Query
                </Button>
              </div>
            </form>
          </Form>

          <Label>Response</Label>
          <Textarea defaultValue={response} />
        </div>
      </section>
    </div>
  );
}
export default function IndexPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'ingest';

  return (
    <section className="flex w-full flex-col items-center gap-6">
      <Tabs defaultValue={defaultTab} className="m-4 w-full">
        <div className="flex items-center justify-center">
          <TabsList>
            <TabsTrigger value="ingest">Ingest documents</TabsTrigger>
            <TabsTrigger value="query">Query</TabsTrigger>
          </TabsList>
        </div>
        <div className="w-full">
          <TabsContent value="ingest">
            <IngestTab />
          </TabsContent>
          <TabsContent value="query">
            <QueryTab />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
