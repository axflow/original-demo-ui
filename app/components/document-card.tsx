import type { ContextDocument } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function DocumentCard({
  document,
  idx,
}: {
  document: ContextDocument;
  idx: number;
}) {
  return (
    <Dialog>
      <DialogTrigger className="h-full">
        <Card className="flex min-h-full flex-col items-start hover:bg-border">
          <CardHeader>
            <CardTitle>Chunk #{idx + 1}</CardTitle>
          </CardHeader>
          <CardContent className="text-left text-sm">
            {document.chunk.text.slice(0, 150)}...
          </CardContent>
          {document.similarity && (
            <CardFooter className="flex gap-2">
              <p>similarity:</p>
              <pre className="text-xs">{document.similarity}</pre>
            </CardFooter>
          )}
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chunk #{idx + 1}</DialogTitle>
          <DialogDescription>
            Source:{' '}
            <a className="underline" href={document.chunk.url}>
              {document.chunk.url}
            </a>
          </DialogDescription>
        </DialogHeader>
        <div>{document.chunk.text}</div>
      </DialogContent>
    </Dialog>
  );
}
