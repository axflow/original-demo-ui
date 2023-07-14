'use-client';

import MonacoEditor from '@monaco-editor/react';

import { theme as defaultTheme, lightTheme } from '@/components/monaco-theme';

type PropsType = {
  code: string;
  theme?: 'default' | 'light';
  onChange: (code: string) => void;
};

export default function CodeEditor(props: PropsType) {
  const theme = props.theme || 'default';
  const bgColor =
    theme === 'default'
      ? defaultTheme.colors['editor.background']
      : lightTheme.colors['editor.background'];

  return (
    <div className={`rounded-lg py-3`} style={{ backgroundColor: bgColor }}>
      <MonacoEditor
        language="javascript"
        theme={theme}
        height="300px"
        value={props.code}
        options={{
          minimap: {
            enabled: false,
          },
          scrollbar: {
            vertical: 'hidden',
            alwaysConsumeMouseWheel: false,
          },
          overviewRulerLanes: 0,
          scrollBeyondLastLine: false,
          guides: {
            indentation: false,
          },
          occurrencesHighlight: false,
          renderLineHighlight: 'none',
          fontFamily: 'JetBrains Mono, Droid Sans Mono, monospace',
          fontSize: 14,
          tabIndex: -1,
          tabSize: 2,
          formatOnType: true,
          formatOnPaste: true,
          tabCompletion: 'on',
          suggestSelection: 'first',
          wordWrap: 'off',
        }}
        onChange={(value) => props.onChange(value || '')}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme('default', defaultTheme);
          monaco.editor.defineTheme('light', lightTheme);
        }}
      />
    </div>
  );
}
