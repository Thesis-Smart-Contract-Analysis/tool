import React from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { RESULT_TYPE } from "@/enums";
import ResultHighLight from "@/ResultHighLight/ResultHighLight";

import "./ResultBoard.scss";

const ResultBoard: React.FC<{
  title: string;
  time: number;
  type: RESULT_TYPE;
}> = ({ title, time, type }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Box className="result-board">
        <Typography className={`result-board__title--${type}`}>
          {title}
        </Typography>

        {time ? (
          <Typography className="result-board__time">{`${t(
            "content.result.result-board.scan-time"
          )}: ${time}s`}</Typography>
        ) : null}
      </Box>

      <Box className="code-editor__wrapper">
        <ResultHighLight type={type} />
      </Box>
    </React.Fragment>
  );
};

export default ResultBoard;
