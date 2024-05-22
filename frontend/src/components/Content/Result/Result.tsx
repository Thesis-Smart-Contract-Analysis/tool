import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';
import { Editor } from '@monaco-editor/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import './Result.scss';
import { ResultContext } from '@/context/ResultContext';

const Result: React.FC = () => {
  const { t } = useTranslation();
  const { result, isResultLoading, currentSourceCode, setCurrentSourceCode } =
    useContext(ResultContext);

  console.log(result);

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
            loading={isResultLoading}
            value={currentSourceCode}
            onChange={(value) => setCurrentSourceCode(value as string)}
            defaultLanguage='sol'
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Result;
