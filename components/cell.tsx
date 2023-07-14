'use client';

import { useState } from 'react';

import CodeEditor from '@/components/code-editor';
import { Icons } from '@/components/icons';

const fib = `function fib(n) {
  if (n === 0 || n === 1) {
    return n;
  }

  return fib(n - 1) + fib(n - 2)
}
`;

export default function Cell() {
  const [value, setValue] = useState<string>('');
  const [evalCount, setEvalCount] = useState(0);

  async function evaluate(code: string) {
    // Force an update every time evaluation happens:
    setEvalCount(evalCount + 1);

    console.log('Evaling ', code);
    const result = '10';

    setValue(result);
  }

  return (
    <CellInner
      code={fib}
      value={value}
      stdout={['omg']}
      evaluate={evaluate}
      evalCount={evalCount}
    />
  );
}

type CellInnerPropsType = {
  code?: string;
  value: string;
  stdout: string[];
  evaluate: (code: string) => void;
  evalCount: number;
};

function CellInner(props: CellInnerPropsType) {
  const [code, setCode] = useState<string>(props.code || '');

  return (
    <div className="flex flex-col">
      <div className="my-2">
        <span
          className="flex cursor-pointer items-center font-semibold"
          onClick={() => {
            props.evaluate(code);
          }}
        >
          <Icons.playCircle className="mr-1 h-5 w-5" /> Evaluate
        </span>
      </div>
      <CodeEditor code={code} onChange={setCode} />
      {props.evalCount > 0 && (
        <div className="my-2 rounded-lg border border-zinc-300 text-sm">
          {props.stdout.length > 0 && (
            <pre className="border-b border-zinc-300 p-4">
              <code className="block">{props.stdout.join('\n')}</code>
            </pre>
          )}
          <pre className="p-4">
            <code className="block">{props.value}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
