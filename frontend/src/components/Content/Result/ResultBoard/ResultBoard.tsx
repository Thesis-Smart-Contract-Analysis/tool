import React from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { RESULT_TYPE } from "@/enums";

import "./ResultBoard.scss";
import CheckListBoard from "../ResultCheckList/CheckListBoard/CheckListBoard";

const ResultBoard: React.FC<{
  title: string;
  time: number;
  type: RESULT_TYPE;
}> = ({ title, time, type }) => {
  const { t } = useTranslation();

  return (
    <Box className="result-board">
      <Box className="result-board__title">
        <Typography className={`text--${type}`}>{title}</Typography>

        {time ? (
          <Typography className="time">{`${t(
            "content.result.result-board.scan-time"
          )}: ${time}s`}</Typography>
        ) : null}
      </Box>
      <CheckListBoard type={RESULT_TYPE.SO1SCAN} />
    </Box>
  );
};

export default ResultBoard;
