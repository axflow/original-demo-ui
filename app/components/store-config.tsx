'use client';
import { useConfig } from '@/app/components/config-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import type { ChromaStore, PineconeStore } from '@/types/store';

export function ChromaStoreConfigForm() {
  // This is pretty hard coded and read-only
  // It would be nice to improve modularity
  const defaultChromaStore = {
    name: 'chroma',
    collection: 'vectors',
    url: 'http://localhost:8000',
  } as ChromaStore;

  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">collection</TableCell>
            <TableCell>{defaultChromaStore.collection}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">url</TableCell>
            <TableCell>{defaultChromaStore.url}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export function PineconeStoreConfigForm() {
  const defaultPineconeStore = {
    name: 'pinecone',
    indexName: 'index',
    indexDimensions: 1536,
    environment: 'northamerica-northeast1-gcp',
    namespace: 'default',
  } as PineconeStore;
  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">index name</TableCell>
            <TableCell className="text-right">
              <Badge variant="secondary">{defaultPineconeStore.indexName}</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">dimensions</TableCell>
            <TableCell className="text-right">
              <Badge variant="secondary">{defaultPineconeStore.indexDimensions}</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">namespace</TableCell>
            <TableCell className="text-right">
              <Badge variant="secondary">{defaultPineconeStore.namespace}</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">environment</TableCell>
            <TableCell className="text-right">
              <Badge variant="secondary">{defaultPineconeStore.environment}</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export function VectorStoreWidget() {
  const { store, setStore } = useConfig();

  const sendToast = (key: string, value: string) => {
    return toast({
      title: `Updated ${key}`,
      description: value,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="justify between flex items-center gap-4 pt-2">
        <Label>Store</Label>
        <Select
          onValueChange={(e) => {
            setStore(e);
            sendToast('store', e);
          }}
          defaultValue={store}
        >
          <SelectTrigger>
            <SelectValue placeholder="select store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pinecone">pinecone</SelectItem>
            <SelectItem value="chroma">chroma</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {store === 'pinecone' && <PineconeStoreConfigForm />}
      {store === 'chroma' && <ChromaStoreConfigForm />}
    </div>
  );
}
