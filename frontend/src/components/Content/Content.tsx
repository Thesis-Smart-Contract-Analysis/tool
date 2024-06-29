import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ResultContext } from '@/context/ResultContext';

import AuditReport from '../AuditReport/AuditReport';
import './Content.scss';
import Result from './Result/Result';
import ScanWithChatGPT from './ScanWithChatGPT/ScanWithChatGPT';
import Upload from './Upload/Upload';

const Content: React.FC = () => {
  const { t } = useTranslation();
  const { result, currentFileName, currentSourceCode } =
    useContext(ResultContext);

  return (
    <Container>
      <Box className='content'>
        <Typography className='content__title'>{t('content.title')}</Typography>
        <Upload />
        {result ? <Result /> : null}
        {result?.success ? (
          <AuditReport
            smartContractName={currentFileName}
            scanningTime={result.scan_time}
            linesOfCode={
              currentSourceCode.split('').filter((c) => c === '\n').length + 1
            }
          />
        ) : null}
        <ScanWithChatGPT />
      </Box>
    </Container>
  );
};

export default Content;
