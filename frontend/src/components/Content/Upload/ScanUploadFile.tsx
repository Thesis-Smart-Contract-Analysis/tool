import React, { useCallback } from "react";

import { Editor } from "@monaco-editor/react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { AxiosError } from "axios";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BackupIcon from "@mui/icons-material/Backup";
import CancelIcon from "@mui/icons-material/Cancel";

import { uploadFile } from "@/apis/services/upload";

const ScanUploadFile: React.FC<{
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setIsUpLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPreviewCode: React.Dispatch<React.SetStateAction<string>>;
  setCurrentFileName: React.Dispatch<React.SetStateAction<string>>;
  isUploading: boolean;
  files: File[];
  previewCode: string;
}> = ({
  setFiles,
  setIsUpLoading,
  setPreviewCode,
  setCurrentFileName,
  isUploading,
  files,
  previewCode,
}) => {
  const { t } = useTranslation();

  const handleDeleteFile = (file: File) => {
    setFiles((prev) => {
      return prev.filter((f) => f !== file);
    });

    setPreviewCode("");
  };

  const handleChooseFile = useCallback(
    async (file: File) => {
      const src = await file.text();

      setPreviewCode(src);

      setCurrentFileName(file.name);
    },
    [setPreviewCode, setCurrentFileName]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const currentFile = acceptedFiles[0];

      if (files.find((file) => file.name === currentFile.name)) {
        alert(t("content.upload.file-exist"));
      } else {
        try {
          setIsUpLoading(true);

          await uploadFile(acceptedFiles[0]);

          setFiles((prev) => [...prev, ...acceptedFiles]);

          await handleChooseFile(currentFile);
        } catch (error) {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
          }
        } finally {
          setIsUpLoading(false);
        }
      }
    },
    [t, setFiles, setIsUpLoading, handleChooseFile, files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <React.Fragment>
      <Box className={`upload-file__wrapper`}>
        {isUploading ? (
          <h1>Loading ...</h1>
        ) : (
          <React.Fragment>
            <Box component="div" className="upload-file__list">
              <Typography className="title">{"Danh sách file"}</Typography>
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
                        {(file.size / 1000).toFixed(3)} KB
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
            </Box>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              gap={1}
              className="upload-file__dropzone"
              {...getRootProps()}
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
          </React.Fragment>
        )}
      </Box>
      <Box className={`code-editor__wrapper`}>
        <Editor
          value={previewCode}
          defaultLanguage="sol"
          options={{
            readOnly: true,
          }}
        />
      </Box>
    </React.Fragment>
  );
};

export default ScanUploadFile;
