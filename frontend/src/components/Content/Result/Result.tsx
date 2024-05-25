import React, { useContext, useEffect } from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { ResultContext } from "@/context/ResultContext";
import { RESULT_TYPE } from "@/enums";

import ResultBoard from "./ResultBoard/ResultBoard";
import ResultCheckList from "./ResultCheckList/ResultCheckList";
import "./Result.scss";

const Result: React.FC = () => {
  const { t } = useTranslation();
  const { result } = useContext(ResultContext);

  useEffect(() => {
    if (result) {
      document.getElementById("result")?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [result]);

  const isHiddenResult =
    result?.full_coverage ||
    (!result?.mythril.findings.length && !result?.slither.findings.length);

  return (
    <Box className="result-wrapper">
      <Box className="result">
        <span
          style={{
            position: "absolute",
            top: "-4rem",
          }}
          id="result"
        ></span>

        <Typography className="result__title">
          {t("content.result.title")}
        </Typography>

        <Box className="result__content">
          <ResultBoard
            title="So1Scan"
            time={result?.semantic_grep.scan_time as number}
            type={RESULT_TYPE.SO1SCAN}
          />

          {isHiddenResult ? null : <ResultCheckList />}
        </Box>
      </Box>
    </Box>
  );
};

export default Result;
