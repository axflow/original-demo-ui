'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
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

function IngestWikipedia() {
  const WikipediaFormSchema = z.object({
    term: z.string({
      required_error: 'Please select a term to search wikipedia for',
    }),
  });
  const wikipediaForm = useForm<z.infer<typeof WikipediaFormSchema>>({
    resolver: zodResolver(WikipediaFormSchema),
    defaultValues: { term: 'San Francisco' },
  });
  function onSubmitWikipedia(data: z.infer<typeof WikipediaFormSchema>) {
    toast({
      title: 'Ingestion wikipedia term',
      description: <p>{data.term}</p>,
    });
  }

  return (
    <div className="max-w-xl">
      <Form {...wikipediaForm}>
        <form onSubmit={wikipediaForm.handleSubmit(onSubmitWikipedia)}>
          <FormField
            control={wikipediaForm.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <div className="mt-4 flex items-center gap-2">
                  <FormLabel className="min-w-fit">wikipedia term</FormLabel>
                  <FormControl>
                    <Input type="string" {...field} />
                  </FormControl>
                </div>
                <FormDescription>
                  Specify a wikipedia term and we will automatically fetch and ingest it into the
                  configured store.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-4 flex items-center justify-center">
            <Button type="submit" className="mt-4">
              Ingest
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function IngestDocumentUpload() {
  interface IFormInput {
    document: FileList;
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onUpload: SubmitHandler<IFormInput> = async (data) => {
    const firstDoc = data.document[0];
    let formData = new FormData();
    formData.append('file', firstDoc);

    const response = await window.fetch('/api/upload', {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: formData,
    });
    // TODO: ingest this into the vector store
    const responseData = await response.json();
    console.log(responseData.content.slice(1, 300), '...');
    toast({
      title: `Uploaded file`,
      description: <p>{firstDoc.name}</p>,
    });
  };

  const validateFile = (file: FileList) => {
    if (file.length !== 1) {
      return false;
    }

    const filename = file[0].name;
    if (!filename.endsWith('.md') && !filename.endsWith('.mdx')) {
      return false;
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onUpload)}>
      <div className="flex flex-col">
        <div className="mt-4 flex items-center gap-2">
          <Label className="min-w-fit" htmlFor="document">
            Upload document
          </Label>
          <Input
            {...register('document', { required: true, validate: validateFile })}
            type="file"
            className="file:rounded file:bg-input hover:file:cursor-pointer file:hover:bg-accent"
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          We currently only support markdown files (.md)
        </p>
        {errors.document?.type === 'required' && (
          <p className="text-sm text-destructive">This field is required</p>
        )}
        {errors.document?.type === 'validate' && (
          <p className="text-sm text-destructive">Please upload a markdown file</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <Button type="submit" className="mt-4" disabled={!!errors.document}>
          Upload
        </Button>
      </div>
    </form>
  );
}

function IngestTab() {
  const router = useRouter();
  const pathname = usePathname();
  router.push(pathname + '?tab=ingest');

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
  router.push(pathname + '?tab=query');
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
          <Textarea placeholder="" value={response} />
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
