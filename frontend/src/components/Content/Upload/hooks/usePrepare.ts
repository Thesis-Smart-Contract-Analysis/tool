import { useContext, useState } from 'react';

import { SelectChangeEvent } from '@mui/material';

import { scanSourceCode } from '@/apis/services/scan';
import { InitResult, ResultContext } from '@/context/ResultContext';
import { SCANNING_TOOL } from '@/enums';
import { IResult } from '@/interfaces';

import { SCAN_MODE } from '../constant';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';

const usePrepare = () => {
  const { t } = useTranslation();

  const {
    setIsSemgrepResultLoading,
    setIsSlitherResultLoading,
    setIsMythrilResultLoading,
    setSemgrepResult,
    setSlitherResult,
    setMythrilResult,
    setCurrentSourceCode,
    setCurrentFileName,
    setResult,
    currentFileName,
    isResultLoading,
  } = useContext(ResultContext);

  const [previewCode, setPreviewCode] = useState('');
  const [code, setCode] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUpLoading] = useState(false);
  const [scanMode, setScanMode] = useState(SCAN_MODE.CHOOSE_FILE);

  const scanSmartContractWithCallBack = async (
    sourceCode: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (..._: any[]) => Promise<AxiosResponse<any, any>>,
  ) => {
    setCurrentSourceCode(sourceCode);

    setIsSemgrepResultLoading(true);
    const { data: semantic_grep } = await callback(
      sourceCode,
      SCANNING_TOOL.SEMANTIC_GREP,
    );
    setIsSemgrepResultLoading(false);

    if (semantic_grep.success === false) {
      toast.error(t('error.scan-with-So1Scan'));
      console.error(semantic_grep.errors);
    }

    setSemgrepResult(semantic_grep);

    setIsSlitherResultLoading(true);
    const { data: slither } = await callback(sourceCode, SCANNING_TOOL.SLITHER);
    setIsSlitherResultLoading(false);

    if (slither.success === false) {
      toast.error(t('error.scan-with-Slither'));
      console.error(slither.errors);
    }

    setSlitherResult(slither);

    setIsMythrilResultLoading(true);
    const { data: mythril } = await callback(sourceCode, SCANNING_TOOL.MYTHRIL);
    setIsMythrilResultLoading(false);

    if (mythril.success === false) {
      toast.error(t('error.scan-with-Mythril'));
      console.error(mythril.errors);
    }

    setMythrilResult(mythril);

    setResult((prev) => {
      return {
        ...prev,
        semantic_grep,
        slither,
        mythril,
        success: semantic_grep.success && slither.success && mythril.success,
        scan_time:
          semantic_grep.scan_time + slither.scan_time + mythril.scan_time,
      } as IResult;
    });
  };

  const handleScanFile = async () => {
    try {
      setCurrentSourceCode('');
      setResult(InitResult);
      setSemgrepResult(null);
      setSlitherResult(null);
      setMythrilResult(null);

      if (scanMode === SCAN_MODE.CHOOSE_FILE) {
        await scanSmartContractWithCallBack(previewCode, scanSourceCode);
      } else if (scanMode === SCAN_MODE.SOURCE_CODE) {
        await scanSmartContractWithCallBack(code, scanSourceCode);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSemgrepResultLoading(false);
      setIsSlitherResultLoading(false);
      setIsMythrilResultLoading(false);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setScanMode(event.target.value as string);
  };

  return {
    handleScanFile,
    handleChange,
    setPreviewCode,
    setCode,
    setFiles,
    setIsUpLoading,
    setCurrentFileName,
    previewCode,
    code,
    files,
    isUploading,
    currentFileName,
    isResultLoading,
    scanMode,
  };
};

export default usePrepare;
