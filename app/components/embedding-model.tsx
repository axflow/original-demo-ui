'use client';
import { useConfig } from '@/app/components/config-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function EmbeddingModel() {
  const { embeddingModel, setEmbeddingModel } = useConfig();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <Label className="w-1/2">Model</Label>
        <Select onValueChange={setEmbeddingModel} defaultValue={embeddingModel}>
          <SelectTrigger>
            <SelectValue placeholder="select embedding model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text-embedding-ada-002">text-embedding-ada-002</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
