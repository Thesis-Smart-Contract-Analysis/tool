import React, { useContext } from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "./Result.scss";
import { ResultContext } from "@/context/ResultContext";
import CodeEditor from "@/CodeEditor/CodeEditor";

const Result: React.FC = () => {
  const { t } = useTranslation();
  const { result, isResultLoading, currentSourceCode, setCurrentSourceCode } =
    useContext(ResultContext);

  console.log(result);

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
          <Box className="code-editor__wrapper">
            <CodeEditor
              code={currentSourceCode}
              setCode={setCurrentSourceCode}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Result;
