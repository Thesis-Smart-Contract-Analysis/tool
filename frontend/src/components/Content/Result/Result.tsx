import React, { useContext, useEffect } from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { RESULT_TYPE } from "@/enums";
import { ResultContext } from "@/context/ResultContext";

import "./Result.scss";
import ResultBoard from "./ResultBoard/ResultBoard";
import ResultCheckList from "./ResultCheckList/ResultCheckList";

const Result: React.FC = () => {
  const { t } = useTranslation();
  const { semgrepResult } = useContext(ResultContext);

  useEffect(() => {
    document.getElementById("result")?.scrollIntoView({
      behavior: "smooth",
    });
  }, [semgrepResult]);

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
          <ResultBoard title="So1Scan" type={RESULT_TYPE.SO1SCAN} />

          {semgrepResult ? <ResultCheckList /> : null}
        </Box>
      </Box>
    </Box>
  );
};

export default Result;
