'use client';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';

export function QueryConfigForm() {
  const FormSchema = z.object({
    model: z.string({
      required_error: 'A model is required',
    }),
    topK: z
      .number({
        required_error: 'Select how many documents should be added to the context.',
      })
      .max(10, { message: 'TopK value must be less than 10.' }),
    temperature: z.number().min(0).max(1),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topK: 3,
      model: 'gpt-4',
      temperature: 0,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel>Model</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5</SelectItem>
                    <SelectItem value="claude-v2">Claude V2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FormDescription>
                The model used for answering the question, with augmented context.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topK"
          render={({ field }) => (
            <FormItem>
              <div className="mt-4 flex items-center gap-4">
                <FormLabel className="min-w-fit">top K</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </div>
              <FormDescription>
                The number of document chunks that will be added to the context at query time.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormControl>
                <div className="flex items-center gap-4">
                  <FormLabel className="min-w-fit">Temperature: {field.value}</FormLabel>
                  <Slider
                    defaultValue={[0]}
                    max={1}
                    step={0.1}
                    onValueChange={(e) => field.onChange(e[0])}
                  />
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription>
                Controls randomness: lowering results in less random completions. As the temperature
                approaches zero, the model will become deterministic and repetitive.
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center justify-center">
          <Button type="submit" className="mt-4">
            Update config
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function StoreConfigForm() {
  type SupportedStore = 'chroma' | 'pgvector' | 'pinecone';
  const [store, setStore] = useState<SupportedStore>('pinecone');

  const FormSchema = z.object({
    store: z.enum(['chroma', 'pgvector', 'pinecone'], {
      required_error: 'Please select a supported store',
    }),
    embeddingModel: z.object({
      name: z.string({
        required_error: 'Please select an embedding model.',
      }),
      dimensions: z.number(),
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      store: 'pinecone',
      embeddingModel: {
        dimensions: 1536,
      },
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="store"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel>Store</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="store" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pinecone">pinecone</SelectItem>
                    <SelectItem value="chroma">chroma</SelectItem>
                    <SelectItem value="pgvector">pgvector</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FormDescription>
                Which store is used for storing document embeddings.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="embeddingModel.name"
          render={({ field }) => (
            <FormItem className="mt-4">
              <div className="flex items-center gap-4">
                <FormLabel className="min-w-fit">Embedding Model</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an embedding model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ada-001">ada-001</SelectItem>
                    <SelectItem value="ada-002">ada-002</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FormDescription>
                This model is used to embed the documents and the query for similarity search.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="embeddingModel.dimensions"
          render={({ field }) => (
            <FormItem className="mt-4">
              <div className="flex items-center gap-4">
                <FormLabel>Dimensions</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center">
          <Button type="submit" className="mt-4">
            Update config
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function Sidebar() {
  return (
    <div
      id="sidebar"
      className="border-1 top-0 h-screen min-w-[400px] border-r border-border bg-background"
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="py-4 text-2xl font-extrabold">Query config</h1>

        <div className="px-4">
          <QueryConfigForm />
        </div>
        <Separator className="mt-4" />
        <h1 className="py-4 text-2xl font-extrabold">Store config</h1>
        <div className="px-4">
          <StoreConfigForm />
        </div>
      </div>
    </div>
  );
}
