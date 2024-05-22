import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { RESULT_TYPE } from "@/enums";

import CheckListBoard from "./CheckListBoard/CheckListBoard";
import "./ResultCheckList.scss";

const ResultCheckList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box className="result-checklist">
      <Typography className="result-checklist__title">
        {t("content.result.check-list.title")}
      </Typography>

      <Box className="result-checklist__boards">
        <CheckListBoard type={RESULT_TYPE.SLITHER} />
        <CheckListBoard type={RESULT_TYPE.MYTHRIL} />
      </Box>
    </Box>
  );
};

export default ResultCheckList;
