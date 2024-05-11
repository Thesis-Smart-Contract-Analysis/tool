import React, { useCallback } from "react";

import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BackupIcon from "@mui/icons-material/Backup";

import "./Content.scss";

const Content: React.FC = () => {
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("🚀 ~ onDrop ~ acceptedFiles:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Container>
      <Box className="content">
        <Box className="content__wrapper">
          <Box className="content-upload-file__wrapper">
            <Box
              component="div"
              className="content-upload-file__control"
              {...getRootProps()}
            >
              <input id="upload-file" type="file" {...getInputProps()} />

              <BackupIcon />

              {isDragActive ? (
                <Typography> - {t("file.drop-file-content")} - </Typography>
              ) : (
                <React.Fragment>
                  <Typography>{t("file.drag-file-content")}</Typography>

                  <Typography> - {t("common.or")} - </Typography>
                </React.Fragment>
              )}

              <label
                htmlFor="upload-file"
                className="upload-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {t("file.browse-file")}
              </label>
            </Box>
          </Box>
          <Box className="content-code-editor__wrapper"></Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Content;
