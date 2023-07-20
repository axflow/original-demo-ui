'use client';
import { EmbeddingModel } from '@/app/components/embedding-model';
import { VectorStoreWidget } from '@/app/components/store-config';
import { QueryConfigForm } from '@/app/components/query-config';
import { Separator } from '@/components/ui/separator';

export default function Sidebar() {
  return (
    <div
      id="sidebar"
      className="border-1 top-0 h-screen min-w-[400px] border-r border-border bg-background"
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="py-4 text-2xl font-extrabold">Query config</h1>

        <div className="w-full px-4">
          <QueryConfigForm />
        </div>
        <Separator className="mt-4" />
        <h1 className="py-4 text-2xl font-extrabold">Vector store</h1>
        <div className="w-full px-4">
          <VectorStoreWidget />
        </div>
        <Separator className="mt-4" />
        <h1 className="py-4 text-2xl font-extrabold">Embedding model</h1>
        <div className="w-full px-4">
          <EmbeddingModel />
        </div>
      </div>
    </div>
  );
}
