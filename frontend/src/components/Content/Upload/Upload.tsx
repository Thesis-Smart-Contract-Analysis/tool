import React, { useCallback, useContext, useState } from 'react';

import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { Editor } from "@monaco-editor/react";

import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BackupIcon from "@mui/icons-material/Backup";
import Stack from "@mui/material/Stack";

import './Upload.scss';
import { ResultContext } from '@/context/ResultContext';
import { scanFile, scanSourceCode } from '@/apis/services/scan';

const Upload: React.FC = () => {
  const { t } = useTranslation();
  const { setIsResultLoading, setResult, setCurrentSourceCode } =
    useContext(ResultContext);

  const [code, setCode] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.find((file) => file.name === acceptedFiles[0].name))
        alert("Trùng tên file");
      else setFiles((prev) => [...prev, ...acceptedFiles]);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const handleDeleteFile = (file: File) => {
    setFiles((prev) => {
      return prev.filter((f) => f !== file);
    });
  };

  const handleChooseFile = async (file: File) => {
    const text = await file.text();
    setCode(text);
  };

  const handleScanFile = async () => {
    try {
      setIsResultLoading(true);

      const { data } = await scanFile('lotto.sol');

      setCurrentSourceCode(code);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsResultLoading(false);
    }
  };

  return (
    <Box className="upload">
      <Typography className="upload__title">
        {t("content.upload.title")}
      </Typography>

      <Box className="upload__content">
        <Box className="upload-file__wrapper">
          <Box
            component="div"
            className="upload-file__list"
            {...getRootProps()}
          >
            {files?.map((file) => {
              return (
                <Box
                  key={file.size + file.name}
                  className="upload-file__item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChooseFile(file);
                  }}
                >
                  <Stack className="title" gap={1}>
                    <Typography variant="body1">{file.name}</Typography>
                    <Typography variant="body2">
                      {Math.floor(file.size / 1000)} KB
                    </Typography>
                  </Stack>

                  <Box className="action">
                    <CancelIcon
                      fontSize="large"
                      color="action"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file);
                      }}
                    />
                  </Box>
                </Box>
              );
            })}

            <Stack
              justifyContent={"flex-end"}
              alignItems={"center"}
              gap={1}
              className="upload-file__dropzone"
            >
              <input id="upload-file-o" type="file" {...getInputProps()} />

              <BackupIcon className="icon" />

              <Typography className="text">{t("common.choose")}</Typography>

              <Typography className="text">- {t("common.or")} -</Typography>

              <Typography className="text">
                {isDragActive
                  ? t("content.upload.drop-file-content")
                  : t("content.upload.drag-file-content")}
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Box className="code-editor__wrapper">
          <Editor
            value={code}
            onChange={(value) => setCode(value as string)}
            defaultLanguage="sol"
          />
        </Box>
      </Box>

      <Box className='upload__control'>
        <a
          href='#result'
          onClick={handleScanFile}
        >
          {t('content.upload.scan-file')}
        </a>
      </Box>
    </Box>
  );
};

export default Upload;
