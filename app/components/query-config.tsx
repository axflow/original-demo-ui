'use client';
import { ChangeEvent } from 'react';
import {
  useConfig,
  DEFAULT_CHAT_MODEL,
  DEFAULT_COMPLETION_MODEL,
} from '@/app/components/config-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

export function QueryConfigForm() {
  const { completionModel, chatModel, topK, temperature, includeDocs } = useConfig();
  const { setCompletionModel, setChatModel, setTopK, setTemperature, setIncludeDocs } = useConfig();

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
  };

  const updateConfig = (value: string) => {
    if (value === 'chat') {
      setChatModel(DEFAULT_CHAT_MODEL);
      setCompletionModel('');
    } else if (value === 'completion') {
      setCompletionModel(DEFAULT_COMPLETION_MODEL);
      setChatModel('');
    } else {
      throw new Error('Invalid model type');
    }
  };

  return (
    <Tabs defaultValue="chat" className="w-full" onValueChange={updateConfig}>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between gap-4 pt-2">
          <Label className="w-1/2">Model type</Label>
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="completion">Completion</TabsTrigger>
          </TabsList>
        </div>
        <div className="w-full">
          <TabsContent value="chat">
            <div className="flex w-full items-center justify-between gap-4 pt-2">
              <Label className="w-full">Chat model</Label>
              <Select
                onValueChange={(e) => {
                  setChatModel(e);
                  sendToast('chat model', e);
                }}
                value={chatModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">gpt-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          <TabsContent value="completion">
            <div className="flex w-full items-center justify-between gap-4 pt-2">
              <Label className="w-full">Completion model</Label>
              <Select
                onValueChange={(e) => {
                  setCompletionModel(e);
                  sendToast('completion model', e);
                }}
                value={completionModel}
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
          </TabsContent>
        </div>

        <div className="flex items-center gap-4">
          <Label className="w-full">Top K</Label>
          <Input onChange={validateAndSubmitTopK} value={topK} />
        </div>

        <div className="flex items-center gap-4 py-2">
          <Label className="w-full">Temperature</Label>
          <p className="pl-4">{temperature}</p>
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
          <Label className="w-full">Include documents</Label>
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
    </Tabs>
  );
}
