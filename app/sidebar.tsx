'use client';
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
import { toast } from '@/components/ui/use-toast';

const FormSchema = z.object({
  model: z.string({
    required_error: 'Please select a model.',
  }),
  embeddingModel: z.object({
    name: z.string({
      required_error: 'Please select an embedding model.',
    }),
    dimensions: z.number(),
  }),
});

export function SelectModelForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      embeddingModel: {
        dimensions: 1536,
      },
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('firing');
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
              <FormDescription>
                The model used for answering the question, given documents.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="embeddingModel.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Embedding Model</FormLabel>
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
            <FormItem>
              <FormLabel>Dimensions</FormLabel>
              <FormControl>
                <Input type="number" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4">
          Save config
        </Button>
      </form>
    </Form>
  );
}

export default function Sidebar() {
  return (
    <div
      id="sidebar"
      className="border-1 sticky top-0 h-screen min-w-[300px] border-r border-border bg-background"
    >
      <div className="flex flex-col">
        <h1 className="flex h-16 flex-col items-center justify-center text-2xl font-extrabold">
          Config
        </h1>
        <Separator className="mb-2" />

        <div className="p-4">
          <SelectModelForm />
        </div>
      </div>
    </div>
  );
}
