import { Editor } from '@monaco-editor/react';

import Box from '@mui/material/Box';

const ScanSourceCode: React.FC<{
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ code, setCode }) => {
  return (
    <Box className='code-editor__wrapper code-editor__wrapper--full'>
      <Editor
        value={code}
        onChange={(value) => {
          setCode(value as string);
        }}
        defaultLanguage='sol'
      />
    </Box>
  );
};

export default ScanSourceCode;
