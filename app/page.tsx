'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IngestWikipedia } from '@/app/components/ingest-wikipedia';
import { IngestDocumentUpload } from '@/app/components/ingest-upload';
import { QueryWidget } from '@/app/components/query';

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

  return <QueryWidget />;
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
