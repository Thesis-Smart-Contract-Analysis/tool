import React from 'react';

import { useTranslation } from 'react-i18next';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Result from './Result/Result';
import Upload from './Upload/Upload';
import './Content.scss';

const Content: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Box
        className='content'
        id='scan-now'
      >
        <Typography className='content__title'>{t('content.title')}</Typography>
        <Upload />
        <Result />
      </Box>
    </Container>
  );
};

export default Content;
