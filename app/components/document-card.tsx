import type { ContextDocument } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DocumentCard({
  document,
  idx,
}: {
  document: ContextDocument;
  idx: number;
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Document chunk #{idx}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">{document.chunk.text}</CardContent>
        {document.similarity && (
          <CardFooter className="flex gap-2">
            <p>similarity:</p>
            <pre className="text-sm">{document.similarity}</pre>
          </CardFooter>
        )}
      </Card>
    </>
  );
}
