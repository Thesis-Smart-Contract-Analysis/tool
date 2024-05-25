import { useContext } from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { RESULT_TYPE } from "@/enums";
import { ResultContext } from "@/context/ResultContext";

import CheckListBoard from "./CheckListBoard/CheckListBoard";
import "./ResultCheckList.scss";

const ResultCheckList: React.FC = () => {
  const { t } = useTranslation();
  const { result } = useContext(ResultContext);

  return (
    <Box className="result-checklist">
      <Typography className="result-checklist__title">
        {t("content.result.check-list.title")}
      </Typography>

      <Box className="result-checklist__boards">
        {result?.slither.findings.length ? (
          <CheckListBoard type={RESULT_TYPE.SLITHER} />
        ) : null}

        {result?.mythril.findings.length ? (
          <CheckListBoard type={RESULT_TYPE.MYTHRIL} />
        ) : null}
      </Box>
    </Box>
  );
};

export default ResultCheckList;
