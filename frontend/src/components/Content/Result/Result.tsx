import React, { useContext } from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "./Result.scss";
import { ResultContext } from "@/context/ResultContext";
import { RESULT_TYPE } from "@/enums";
import ResultBoard from "./ResultBoard/ResultBoard";

const Result: React.FC = () => {
  const { t } = useTranslation();
  const { isResultLoading, result } = useContext(ResultContext);

  return (
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
        {isResultLoading ? (
          <h1>Loading ...</h1>
        ) : (
          <React.Fragment>
            <ResultBoard
              title="So1Scan"
              time={result?.semantic_grep.scan_time as number}
              type={RESULT_TYPE.SEMGREP}
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
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
};

export default Result;
