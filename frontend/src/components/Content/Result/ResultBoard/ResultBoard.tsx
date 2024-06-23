import React, { useContext } from 'react';

import { LinearProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import { ResultContext } from '@/context/ResultContext';
import { RESULT_TYPE } from '@/enums';

import CheckListBoard from '../ResultCheckList/CheckListBoard/CheckListBoard';
import './ResultBoard.scss';

const ResultBoard: React.FC<{
  title: string;
  type: RESULT_TYPE;
}> = ({ title, type }) => {
  const { t } = useTranslation();
  const { semgrepResult, isSemgrepResultLoading } = useContext(ResultContext);

  return (
    <Box className='result-board'>
      <Box className='result-board__title'>
        <Typography className={`text--${type}`}>{title}</Typography>

        <Box className='time'>
          <Typography className='time__text'>
            {isSemgrepResultLoading
              ? `${t('common.scanning')} ...`
              : `${t(
                  'content.result.result-board.scan-time',
                )}: ${semgrepResult?.scan_time.toFixed(3)}s`}
          </Typography>

          {/* {isSemgrepResultLoading ? (
            <Loading color='#6d6d6d' size={'1.6rem'} />
          ) : null} */}
        </Box>
      </Box>

      {isSemgrepResultLoading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color='primary' />
        </Box>
      ) : null}

      {semgrepResult ? <CheckListBoard type={RESULT_TYPE.SO1SCAN} /> : null}
    </Box>
  );
};

export default ResultBoard;
