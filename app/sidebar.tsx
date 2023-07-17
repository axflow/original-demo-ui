'use client';
import * as Label from '@radix-ui/react-label';
// import * as Select from '@radix-ui/react-select';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  return (
    <div id="sidebar" className="sticky top-0 h-screen min-w-[300px] bg-gray-900">
      <div className="flex flex-col p-4">
        <h1 className="text-2xl font-extrabold">Config</h1>
        <div className="flex flex-col gap-1">
          <Label.Root className="LabelRoot" htmlFor="model">
            Model
          </Label.Root>
          <input className="Input" type="text" id="model" defaultValue="GPT4" />
        </div>
        <Button>Hello world</Button>
        <p>Hello world</p>
        <p>Hello world</p>
        <p>Hello world</p>
        <p>Hello world</p>
        <p>Hello world</p>
      </div>
    </div>
  );
}
