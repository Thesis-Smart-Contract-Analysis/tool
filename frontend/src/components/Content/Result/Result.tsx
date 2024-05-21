import React, { useContext, useEffect } from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "./Result.scss";
import { ResultContext } from "@/context/ResultContext";
import { RESULT_TYPE } from "@/enums";
import ResultBoard from "./ResultBoard/ResultBoard";
import ResultSummary from "./ResultSummary/ResultSummary";

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
          {result?.full_coverage ? null : (
            <React.Fragment>
              <ResultBoard
                title="Slither"
                time={result?.slither.scan_time as number}
                type={RESULT_TYPE.SLITHER}
              />
              <ResultBoard
                title="Mythril"
                time={result?.mythril.scan_time as number}
                type={RESULT_TYPE.MYTHRIL}
              />
            </React.Fragment>
          )}
        </Box>

        <ResultSummary />
      </Box>
    </Box>
  );
};

export default Result;
