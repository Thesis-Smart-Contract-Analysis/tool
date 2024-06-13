import { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ResultContext } from '@/context/ResultContext';
import { RESULT_TYPE } from '@/enums';

import CheckListBoard from './CheckListBoard/CheckListBoard';
import './ResultCheckList.scss';

const FlexBoxShowLoading = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  padding: '1.2rem 0',
});

const TypographyShowLoading = styled(Typography)({
  fontSize: '1.8rem',
  fontWeight: 500,
  color: '#6d6d6d',
  lineHeight: 1,
});

const SlitherCheckListBoard = () => {
  const { t } = useTranslation();
  const { semgrepResult, isSlitherResultLoading } = useContext(ResultContext);

  // Only show slither scanning process when semgrep was already finished
  if (semgrepResult) {
    if (isSlitherResultLoading) {
      return (
        <Stack>
          <FlexBoxShowLoading>
            <TypographyShowLoading>
              {`${t('content.result.check-list.slither')} ...`}
            </TypographyShowLoading>

            {/* <Loading size='1.6rem' color='#6d6d6d' /> */}
          </FlexBoxShowLoading>

          <Box sx={{ width: '100%' }}>
            <LinearProgress color='primary' />
          </Box>
        </Stack>
      );
    } else return <CheckListBoard type={RESULT_TYPE.SLITHER} />;
  }
  return null;
};

const MythrilCheckListBoard = () => {
  const { t } = useTranslation();
  const { slitherResult, isMythrilResultLoading } = useContext(ResultContext);

  // Only show mythril scanning process when slither was already finished
  if (slitherResult) {
    if (isMythrilResultLoading) {
      return (
        <Stack>
          <FlexBoxShowLoading>
            <TypographyShowLoading>
              {`${t('content.result.check-list.mythril')} ... (Hãy kiên nhẫn đợi vì phần này cần thời gian để chạy !!!)`}
            </TypographyShowLoading>

            {/* <Loading size='1.6rem' color='#6d6d6d' /> */}
          </FlexBoxShowLoading>

          <Box sx={{ width: '100%' }}>
            <LinearProgress color='primary' />
          </Box>
        </Stack>
      );
    } else return <CheckListBoard type={RESULT_TYPE.MYTHRIL} />;
  }
  return null;
};

const ResultCheckList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box className='result-checklist'>
      <Typography className='result-checklist__title'>
        {t('content.result.check-list.title')}
      </Typography>

      <Box className='result-checklist__boards'>
        <SlitherCheckListBoard />
        <MythrilCheckListBoard />
      </Box>
    </Box>
  );
};

export default ResultCheckList;
