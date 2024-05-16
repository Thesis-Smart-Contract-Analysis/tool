import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Editor } from '@monaco-editor/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import './Result.scss';

const Result: React.FC = () => {
  const { t } = useTranslation();

  const [code, setCode] = useState('');

  return (
    <Box className='result'>
      <span
        style={{
          position: 'absolute',
          top: '-4rem',
        }}
        id='result'
      ></span>
      <Typography className='result__title'>
        {t('content.result.title')}
      </Typography>
      <Box className='result__content'>
        <Box className='code-editor__wrapper'>
          <Editor
            value={code}
            onChange={(value) => setCode(value as string)}
            defaultLanguage='sol'
          />
        </Box>
        <Box className='code-editor__wrapper'>
          <Editor
            value={code}
            onChange={(value) => setCode(value as string)}
            defaultLanguage='sol'
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Result;
