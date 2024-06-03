import { useContext, useState } from "react";

import { SelectChangeEvent } from "@mui/material";

import { scanSourceCode } from "@/apis/services/scan";
import { InitResult, ResultContext } from "@/context/ResultContext";
import { SCANNING_TOOL } from "@/enums";
import { IResult } from "@/interfaces";

import { SCAN_MODE } from "../constant";

const usePrepare = () => {
  const {
    setIsSemgrepResultLoading,
    setIsSlitherResultLoading,
    setIsMythrilResultLoading,
    setSemgrepResult,
    setSlitherResult,
    setMythrilResult,
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
      setResult(InitResult);
      setSemgrepResult(null);
      setSlitherResult(null);
      setMythrilResult(null);

      if (scanMode === SCAN_MODE.CHOOSE_FILE) {
        setCurrentSourceCode(previewCode);

        setIsSemgrepResultLoading(true);
        const { data: semantic_grep } = await scanSourceCode(
          previewCode,
          SCANNING_TOOL.SEMANTIC_GREP
        );
        setIsSemgrepResultLoading(false);

        setSemgrepResult(semantic_grep);

        setIsSlitherResultLoading(true);
        const { data: slither } = await scanSourceCode(
          previewCode,
          SCANNING_TOOL.SLITHER
        );
        setIsSlitherResultLoading(false);

        setSlitherResult(slither);

        setIsMythrilResultLoading(true);
        const { data: mythril } = await scanSourceCode(
          previewCode,
          SCANNING_TOOL.MYTHRIL
        );
        setIsMythrilResultLoading(false);

        setMythrilResult(mythril);

        setResult((prev) => {
          return {
            ...prev,
            semantic_grep,
            slither,
            mythril,
            scan_time:
              semantic_grep.scan_time + slither.scan_time + mythril.scan_time,
          } as IResult;
        });
      } else if (scanMode === SCAN_MODE.SOURCE_CODE) {
        setCurrentSourceCode(previewCode);

        setIsSemgrepResultLoading(true);
        const { data: semantic_grep } = await scanSourceCode(
          previewCode,
          SCANNING_TOOL.SEMANTIC_GREP
        );
        setIsSemgrepResultLoading(false);

        setSemgrepResult(semantic_grep);

        setIsSlitherResultLoading(true);
        const { data: slither } = await scanSourceCode(
          previewCode,
          SCANNING_TOOL.SLITHER
        );
        setIsSlitherResultLoading(false);

        setSlitherResult(slither);

        setIsMythrilResultLoading(true);
        const { data: mythril } = await scanSourceCode(
          previewCode,
          SCANNING_TOOL.MYTHRIL
        );
        setIsMythrilResultLoading(false);

        setMythrilResult(mythril);

        setResult((prev) => {
          return {
            ...prev,
            semantic_grep,
            slither,
            mythril,
            scan_time:
              semantic_grep.scan_time + slither.scan_time + mythril.scan_time,
          } as IResult;
        });
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
