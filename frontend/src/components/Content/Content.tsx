import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { ResultContext } from '@/context/ResultContext';

import './Content.scss';
import Result from './Result/Result';
import Upload from './Upload/Upload';
import AuditReport from '../AuditReport/AuditReport';

const Content: React.FC = () => {
  const { t } = useTranslation();
  const { result, currentFileName } = useContext(ResultContext);

  return (
    <Container>
      <Box className='content' id='scan-now'>
        <Typography className='content__title'>{t('content.title')}</Typography>
        <Upload />
        {result ? <Result /> : null}
        {result?.success ? (
          <AuditReport
            smartContractName={currentFileName}
            scanningTime={result.scan_time}
          />
        ) : null}
      </Box>
    </Container>
  );
};

export default Content;
