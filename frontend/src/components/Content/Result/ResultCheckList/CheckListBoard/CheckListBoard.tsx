import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
import { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import type { ParseKeys } from 'i18next';

import Box from '@mui/material/Box';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import Typography from '@mui/material/Typography';

import { ResultContext } from '@/context/ResultContext';
import { SLITHER_LINK } from '@/utils/constant';
import { RESULT_TYPE } from '@/enums';
import {
  MythrilFinding,
  SemanticGrepFinding,
  SlitherFinding,
} from '@/interfaces';
import { TCheckList } from '@/types';
import ReadOnlySolidityEditor from '@/components/ReadOnlySolidityEditor/ReadOnlySolidityEditor';
import Severity from '@/components/Severity/Severity';
import { sortBySeverity } from '@/utils/helper';

import './CheckListBoard.scss';
import { useSo1Scan } from './hooks/useSo1Scan';
import { useSlither } from './hooks/useSlither';
import { useMythril } from './hooks/useMythril';

// TODO: Handle when finding is empty or success is false (show error when false)
const CheckListBoard: React.FC<{
  type: RESULT_TYPE;
}> = ({ type }) => {
  const { t } = useTranslation();

  const { semgrepResult, slitherResult, mythrilResult, currentSourceCode } =
    useContext(ResultContext);

  const [currentDecoration, setCurrentDecoration] =
    useState<monaco.editor.IModelDeltaDecoration[]>();

  const [currentChooseId, setCurrentChooseId] = useState('');

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const { handleSo1ScanChoose } = useSo1Scan(setCurrentDecoration);
  const { handleSlitherChoose } = useSlither(setCurrentDecoration);
  const { handleMythrilChoose } = useMythril(setCurrentDecoration);

  useEffect(() => {
    const decorations =
      editorRef.current?.createDecorationsCollection(currentDecoration);

    if (currentDecoration?.length) {
      editorRef.current?.revealRangeInCenter(currentDecoration[0].range);
    }

    return () => {
      decorations?.clear();
    };
  }, [currentDecoration]);

  const handleOnMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const checklist: TCheckList[] | undefined = useMemo(() => {
    if (type === RESULT_TYPE.SO1SCAN) {
      const res = semgrepResult?.findings?.map((finding) => {
        const found = finding.metadata;

        return {
          id: uuidv4(),
          vulId: found.name || found.id,
          severity: found.severity,
          desc: found.message,
          finding,
        };
      });

      const sortedRes = sortBySeverity(res);

      return sortedRes;
    } else if (type === RESULT_TYPE.SLITHER) {
      const res = slitherResult?.findings
        ?.filter((finding) => !finding.metadata.duplicated)
        ?.map((finding) => {
          const found = finding.metadata;

          return {
            id: uuidv4(),
            vulId: found.id,
            severity: found.severity,
            desc: found.description,
            finding,
          };
        });

      const sortedRes = sortBySeverity(res);

      return sortedRes;
    } else if (type === RESULT_TYPE.MYTHRIL) {
      const res = mythrilResult?.findings
        ?.filter((finding) => {
          return (
            !finding.metadata.duplicated &&
            finding.matches.some((match) => match.lineno)
          );
        })
        ?.map((finding) => {
          const found = finding.metadata;

          return {
            id: uuidv4(),
            vulId: found.title,
            severity: found.severity,
            desc: found.description,
            finding,
          };
        });

      const sortedRes = sortBySeverity(res);

      return sortedRes;
    }
  }, [semgrepResult, slitherResult, mythrilResult, type]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnClick = (type: RESULT_TYPE, item: TCheckList) => {
    switch (type) {
      case RESULT_TYPE.SO1SCAN:
        setCurrentChooseId(item.id);
        handleSo1ScanChoose(item.finding as SemanticGrepFinding);
        break;

      case RESULT_TYPE.SLITHER:
        setCurrentChooseId(item.id);
        handleSlitherChoose(item.finding as SlitherFinding);
        break;

      case RESULT_TYPE.MYTHRIL:
        setCurrentChooseId(item.id);
        handleMythrilChoose(item.finding as MythrilFinding);
        break;

      default:
        break;
    }
  };

  return (
    <Box className='checklist-board'>
      {type === RESULT_TYPE.SO1SCAN ? null : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            className={`checklist-board__title checklist-board__title--${type}`}
          >
            <Typography className='text'>
              {t(`content.result.check-list.${type}` as ParseKeys)}
            </Typography>

            <a href={SLITHER_LINK} className='link' target='_blank'>
              <InsertLinkIcon />
            </a>
          </Box>

          <Typography
            sx={{
              fontSize: '1.8rem',
              fontWeight: 500,
              color: '#6d6d6d',
              lineHeight: 1,
            }}
          >
            {type === RESULT_TYPE.SLITHER
              ? `${t(
                  'content.result.result-board.scan-time',
                )}: ${slitherResult?.scan_time.toFixed(3)}s`
              : `${t(
                  'content.result.result-board.scan-time',
                )}: ${mythrilResult?.scan_time.toFixed(3)}s`}
          </Typography>
        </Box>
      )}

      {checklist && checklist.length ? (
        <Box className='checklist-board__content'>
          <Box className='checklist-board__list'>
            {checklist.map((item) => {
              return (
                <Box
                  key={item.id}
                  className={`checklist-board__item  ${
                    currentChooseId === item.id ? `active--${type}` : ''
                  }`}
                  onClick={() => {
                    handleOnClick(type, item);
                  }}
                >
                  <input
                    type='checkbox'
                    id={item.id}
                    style={{
                      display: 'none',
                    }}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleOnClick(type, item);
                      }
                    }}
                  />
                  <label htmlFor={item.id}>
                    <Box className='title'>
                      <Severity type={item.severity.toLowerCase()} />
                      <Typography className='title__id'>
                        {item.vulId}
                      </Typography>
                    </Box>

                    <Box className='desc'>
                      <Markdown>{item.desc}</Markdown>
                    </Box>
                  </label>
                </Box>
              );
            })}
          </Box>

          <Box className='checklist-board__code-editor'>
            <ReadOnlySolidityEditor
              onMount={handleOnMount}
              value={currentSourceCode}
            />
          </Box>
        </Box>
      ) : (
        <Typography
          sx={{
            fontSize: '1.8rem',
            lineHeight: 1,
          }}
        >
          {t('content.result.no-more-result')}
        </Typography>
      )}
    </Box>
  );
};

export default CheckListBoard;
