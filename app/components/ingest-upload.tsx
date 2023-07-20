'use client';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useConfig } from '@/app/components/config-context';
import { toast } from '@/components/ui/use-toast';

export function IngestDocumentUpload() {
  const { store } = useConfig();
  const [ingesting, setIngesting] = useState(false);
  interface IFormInput {
    document: FileList;
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onUpload: SubmitHandler<IFormInput> = async (data) => {
    setIngesting(true);

    const firstDoc = data.document[0];
    let formData = new FormData();
    formData.append('file', firstDoc);
    formData.append('store', store);

    const response = await window.fetch('/api/ingest/upload', {
      method: 'POST',
      body: formData,
    });
    const responseData = await response.json();

    if (responseData.error) {
      toast({
        variant: 'destructive',
        title: 'Error ingesting',
        description: <p>{responseData.error}</p>,
      });
    } else {
      toast({
        title: `Uploaded file`,
        description: <p>{firstDoc.name}</p>,
      });
    }
    setIngesting(false);
  };

  const validateFile = (file: FileList) => {
    if (file.length !== 1) {
      return false;
    }

    const filename = file[0].name;
    if (!filename.endsWith('.md') && !filename.endsWith('.mdx')) {
      return false;
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onUpload)}>
      <div className="flex flex-col">
        <div className="mt-4 flex items-center gap-2">
          <Label className="min-w-fit" htmlFor="document">
            Upload document
          </Label>
          <Input
            {...register('document', { required: true, validate: validateFile })}
            type="file"
            className="file:rounded file:bg-input hover:file:cursor-pointer file:hover:bg-accent"
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          We currently only support markdown files (.md)
        </p>
        {errors.document?.type === 'required' && (
          <p className="text-sm text-destructive">This field is required</p>
        )}
        {errors.document?.type === 'validate' && (
          <p className="text-sm text-destructive">Please upload a markdown file</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <Button type="submit" className="mt-4" disabled={!!errors.document || ingesting}>
          {ingesting ? 'Ingesting' : 'Upload'}
        </Button>
      </div>
    </form>
  );
}
