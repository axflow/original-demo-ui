'use client';
import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export function IngestWikipedia() {
  const [loading, setLoading] = useState<boolean>(false);
  const WikipediaFormSchema = z.object({
    term: z.string({
      required_error: 'Please select a term to search wikipedia for',
    }),
  });
  const wikipediaForm = useForm<z.infer<typeof WikipediaFormSchema>>({
    resolver: zodResolver(WikipediaFormSchema),
    defaultValues: { term: 'San Francisco' },
  });
  async function onSubmitWikipedia(data: z.infer<typeof WikipediaFormSchema>) {
    setLoading(true);
    const response = await fetch('/api/ingest/wikipedia', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ term: data.term }),
    });
    const json = await response.json();
    if (json.error) {
      toast({
        variant: 'destructive',
        title: 'Error ingesting',
        description: <p>{json.error}</p>,
      });
    } else {
      toast({
        title: 'Ingested wikipedia page',
        description: <p>{data.term} </p>,
      });
    }
    setLoading(false);
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
            <Button type="submit" className="mt-4" disabled={loading}>
              {loading ? 'Ingesting...' : 'Ingest'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
