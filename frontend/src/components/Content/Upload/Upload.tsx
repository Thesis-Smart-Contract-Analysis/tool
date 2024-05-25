import React, { useContext, useState } from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

import Loading from "@/components/Loading/Loading";
import { ResultContext } from "@/context/ResultContext";
import { scanSourceCode } from "@/apis/services/scan";

import ScanUploadFile from "./ScanUploadFile";
import ScanSourceCode from "./ScanSourceCode";
import { SCAN_MODE } from "./constant";
import "./Upload.scss";

const Upload: React.FC = () => {
  const { t } = useTranslation();
  const {
    setIsResultLoading,
    setCurrentSourceCode,
    setResult,
    isResultLoading,
  } = useContext(ResultContext);

  const [previewCode, setPreviewCode] = useState("");
  const [code, setCode] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUpLoading] = useState(false);
  const [scanMode, setScanMode] = useState(SCAN_MODE.CHOOSE_FILE);
  const [currentFileName, setCurrentFileName] = useState("");

  const handleScanFile = async () => {
    try {
      setCurrentSourceCode("");
      setResult(null);

      if (scanMode === SCAN_MODE.CHOOSE_FILE) {
        setIsResultLoading(true);

        // const { data } = await scanFile(currentFileName);

        const { data } = await scanSourceCode(previewCode);

        setResult(data);

        setCurrentSourceCode(previewCode);
      } else if (scanMode === SCAN_MODE.SOURCE_CODE) {
        setIsResultLoading(true);

        const { data } = await scanSourceCode(code);

        setResult(data);

        setCurrentSourceCode(code);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsResultLoading(false);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setScanMode(event.target.value as string);
  };

  return (
    <Box className="upload">
      <Typography className="upload__title">
        {t("content.upload.title")}
      </Typography>

      <Box className="upload__scan-mode">
        <Select onChange={handleChange} defaultValue={SCAN_MODE.CHOOSE_FILE}>
          <MenuItem value={SCAN_MODE.CHOOSE_FILE}>
            {t("content.upload.choose-file")}
          </MenuItem>

          <MenuItem value={SCAN_MODE.SOURCE_CODE}>
            {t("content.upload.source-code")}
          </MenuItem>
        </Select>
      </Box>

      <Box className="upload__content">
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
            currentFileName ? "" : "upload__control--disable"
          }`}
        >
          <ButtonBase onClick={handleScanFile}>
            {isResultLoading ? (
              <Loading color="white" size="2rem" />
            ) : (
              t("content.upload.scan")
            )}
          </ButtonBase>
        </Box>
      ) : (
        <Box
          className={`upload__control ${
            code ? "" : "upload__control--disable"
          }`}
        >
          <ButtonBase onClick={handleScanFile}>
            {isResultLoading ? (
              <Loading color="white" size="2rem" />
            ) : (
              t("content.upload.scan")
            )}
          </ButtonBase>
        </Box>
      )}
    </Box>
  );
};

export default Upload;
