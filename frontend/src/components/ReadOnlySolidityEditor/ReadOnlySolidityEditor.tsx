import React from 'react';

import { Editor, OnMount } from '@monaco-editor/react';

const ReadOnlySolidityEditor: React.FC<{ onMount: OnMount; value: string }> = ({
  onMount,
  value,
}) => {
  return (
    <Editor
      onMount={onMount}
      value={value}
      defaultLanguage='sol'
      options={{
        readOnly: true,
      }}
    />
  );
};

export default ReadOnlySolidityEditor;
