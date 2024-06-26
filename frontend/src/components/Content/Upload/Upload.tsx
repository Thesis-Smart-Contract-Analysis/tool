import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { scanWithGPT } from '@/apis/services/scan';
import ScanSourceCode from './ScanSourceCode';
import ScanUploadFile from './ScanUploadFile';
import './Upload.scss';
import { SCAN_MODE } from './constant';
import usePrepare from './hooks/usePrepare';

const Upload: React.FC = () => {
  const { t } = useTranslation();

  const {
    handleChange,
    handleScanFile,
    setCode,
    setCurrentFileName,
    setFiles,
    setIsUpLoading,
    setPreviewCode,
    code,
    currentFileName,
    files,
    isUploading,
    previewCode,
    scanMode,
  } = usePrepare();

  const [testData, setTestData] = useState('');

  return (
    <Box className='upload'>
      <Typography className='upload__title'>
        {t('content.upload.title')}
      </Typography>

      <Box className='upload__scan-mode'>
        <Select onChange={handleChange} defaultValue={SCAN_MODE.CHOOSE_FILE}>
          <MenuItem value={SCAN_MODE.CHOOSE_FILE}>
            {t('content.upload.choose-file')}
          </MenuItem>

          <MenuItem value={SCAN_MODE.SOURCE_CODE}>
            {t('content.upload.source-code')}
          </MenuItem>
        </Select>
      </Box>

      <Box className='upload__content'>
        {scanMode === SCAN_MODE.CHOOSE_FILE ? (
          <ScanUploadFile
            setFiles={setFiles}
            setIsUpLoading={setIsUpLoading}
            setPreviewCode={setPreviewCode}
            setCurrentFileName={setCurrentFileName}
            currentFileName={currentFileName}
            files={files}
            isUploading={isUploading}
            previewCode={previewCode}
          />
        ) : (
          <ScanSourceCode setCode={setCode} code={code} />
        )}
      </Box>

      {scanMode === SCAN_MODE.CHOOSE_FILE ? (
        <Box
          className={`upload__control ${
            currentFileName ? '' : 'upload__control--disable'
          }`}
        >
          <ButtonBase onClick={handleScanFile}>
            {t('content.upload.scan')}
          </ButtonBase>
        </Box>
      ) : (
        <Box
          className={`upload__control ${
            code ? '' : 'upload__control--disable'
          }`}
        >
          <ButtonBase onClick={handleScanFile}>
            {t('content.upload.scan')}
          </ButtonBase>
          <ButtonBase
            onClick={async () => {
              const response = await scanWithGPT(code);
              setTestData(response.data);
              console.log(response);
            }}
          >
            {t('content.upload.scan')}
          </ButtonBase>
        </Box>
      )}
      {testData}
    </Box>
  );
};

export default Upload;
