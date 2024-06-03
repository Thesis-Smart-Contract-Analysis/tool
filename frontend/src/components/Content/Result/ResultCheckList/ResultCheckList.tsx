import { useContext } from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";

import Loading from "@/components/Loading/Loading";
import { RESULT_TYPE } from "@/enums";
import { ResultContext } from "@/context/ResultContext";

import "./ResultCheckList.scss";
import CheckListBoard from "./CheckListBoard/CheckListBoard";

const FlexBoxShowLoading = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  padding: "1.2rem 0",
});

const TypographyShowLoading = styled(Typography)({
  fontSize: "1.8rem",
  fontWeight: 500,
  color: "#6d6d6d",
  lineHeight: 1,
});

const SlitherCheckListBoard = () => {
  const { t } = useTranslation();
  const { semgrepResult, isSlitherResultLoading } = useContext(ResultContext);

  // Only show slither scanning process when semgrep was already finished
  if (semgrepResult) {
    if (isSlitherResultLoading) {
      return (
        <FlexBoxShowLoading>
          <TypographyShowLoading>
            {`${t("content.result.check-list.slither")}`}
          </TypographyShowLoading>
          <Loading size="1.6rem" color="#6d6d6d" />
        </FlexBoxShowLoading>
      );
    } else return <CheckListBoard type={RESULT_TYPE.SLITHER} />;
  }
  return null;
};

const MythrilCheckListBoard = () => {
  const { t } = useTranslation();
  const { slitherResult, isMythrilResultLoading } = useContext(ResultContext);

  // Only show mythril scanning process when slither was already finished
  if (slitherResult) {
    if (isMythrilResultLoading) {
      return (
        <FlexBoxShowLoading>
          <TypographyShowLoading>
            {`${t("content.result.check-list.mythril")}`}
          </TypographyShowLoading>
          <Loading size="1.6rem" color="#6d6d6d" />
        </FlexBoxShowLoading>
      );
    } else return <CheckListBoard type={RESULT_TYPE.MYTHRIL} />;
  }
  return null;
};

const ResultCheckList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box className="result-checklist">
      <Typography className="result-checklist__title">
        {t("content.result.check-list.title")}
      </Typography>

      <Box className="result-checklist__boards">
        <SlitherCheckListBoard />
        <MythrilCheckListBoard />
      </Box>
    </Box>
  );
};

export default ResultCheckList;
