'use client';
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

  return (
    <form onSubmit={handleSubmit(onUpload)}>
      <div className="mt-4 flex items-center gap-2">
        <Label className="min-w-fit" htmlFor="document">
          Upload document
        </Label>
        <Input
          {...register('document', { required: true })}
          type="file"
          className="file:rounded file:bg-input hover:file:cursor-pointer file:hover:bg-accent"
        />
        {errors.document && <p className="text-sm text-destructive">This field is required</p>}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <Button type="submit" className="mt-4">
          Upload
        </Button>
      </div>
    </form>
  );
}

function IngestTab() {
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
  return (
    <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
      Ask your data questions
    </h1>
  );
}
export default function IndexPage() {
  return (
    <section className="flex w-full flex-col items-center gap-6">
      <Tabs defaultValue="ingest" className="m-4">
        <div className="flex items-center justify-center">
          <TabsList>
            <TabsTrigger value="ingest">Ingest documents</TabsTrigger>
            <TabsTrigger value="query">Query</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="ingest">
          <IngestTab />
        </TabsContent>
        <TabsContent value="query">
          <QueryTab />
        </TabsContent>
      </Tabs>
    </section>
  );
}
