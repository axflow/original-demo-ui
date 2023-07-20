'use client';
import { ChangeEvent } from 'react';
import { useConfig } from '@/app/components/config-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

export function QueryConfigForm() {
  const { model, topK, temperature, includeDocs } = useConfig();
  const { setModel, setTopK, setTemperature, setIncludeDocs } = useConfig();

  const sendToast = (key: string, value: string) => {
    return toast({
      title: `Updated query config ${key}`,
      description: `${key} = ${value}`,
    });
  };

  const validateAndSubmitTopK = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) {
      return;
    }
    if (Number(value) < 0 || Number(value) > 10) {
      return;
    }
    setTopK(Number(value));
    sendToast('topK', value);
    return;
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between gap-4 pt-2">
        <Label className="w-1/2">Model</Label>
        <Select
          onValueChange={(e) => {
            setModel(e);
            sendToast('model', e);
          }}
          defaultValue={model}
        >
          <SelectTrigger>
            <SelectValue placeholder="select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text-davinci-003">text-davinci-003</SelectItem>
            <SelectItem value="text-davinci-002">text-davinci-002</SelectItem>
            <SelectItem value="text-davinci-001">text-davinci-001</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <Label className="w-1/2">Top K</Label>
        <Input onChange={validateAndSubmitTopK} value={topK} />
      </div>

      <div className="flex items-center gap-4 py-2">
        <Label className="w-1/2">Temperature</Label>
        <p className="px-4">{temperature}</p>
        <Slider
          defaultValue={[0]}
          max={1}
          step={0.1}
          onValueChange={(e) => {
            setTemperature(e[0]), sendToast('temperature', e[0].toString());
          }}
        />
      </div>

      <div className="flex items-center gap-4 py-2">
        <Label className="w-1/2">Include documents</Label>
        <p className="px-4">{includeDocs}</p>
        <Switch
          checked={includeDocs}
          onCheckedChange={(e) => {
            setIncludeDocs(e);
            sendToast('include docs', e.toString());
          }}
        />
      </div>
    </div>
  );
}
