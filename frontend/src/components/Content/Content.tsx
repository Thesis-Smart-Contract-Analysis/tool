import React, { useContext } from "react";

import { useTranslation } from "react-i18next";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Result from "./Result/Result";
import "./Content.scss";
import Upload from "./Upload/Upload";
import { ResultContext } from "@/context/ResultContext";

const Content: React.FC = () => {
  const { t } = useTranslation();
  const { result } = useContext(ResultContext);

  return (
    <Container>
      <Box className="content" id="scan-now">
        <Typography className="content__title">{t("content.title")}</Typography>
        <Upload />
        {result ? <Result /> : null}
      </Box>
    </Container>
  );
};

export default Content;
