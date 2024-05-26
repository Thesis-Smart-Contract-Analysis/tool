import { useContext, useEffect, useRef, useState } from "react";

import * as monaco from "monaco-editor";
import { Editor, OnMount } from "@monaco-editor/react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InsertLinkIcon from "@mui/icons-material/InsertLink";

import { MythrilFinding, MythrilMatch } from "@/interfaces";
import { ResultContext } from "@/context/ResultContext";
import Severity from "@/components/Severity/Severity";
import { MYTHRIL_LINK } from "@/utils/constant";

const MythrilCheckListBoard = () => {
  const { result, currentSourceCode } = useContext(ResultContext);

  const [currentDecoration, setCurrentDecoration] =
    useState<monaco.editor.IModelDeltaDecoration[]>();

  const [currentChooseId, setCurrentChooseId] = useState("");

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  useEffect(() => {
    const decorations =
      editorRef.current?.createDecorationsCollection(currentDecoration);

    if (currentDecoration) {
      editorRef.current?.revealRange(currentDecoration[0].range);
    }

    return () => {
      decorations?.clear();
    };
  }, [currentDecoration]);

  const handleOnMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const createMythrilDecoration = (match: MythrilMatch) => {
    const start_line = match.lineno as number;
    const start_col = 1;
    const end_line = match.lineno as number;
    const end_col = 100;

    const range = new monaco.Range(start_line, start_col, end_line, end_col);

    const className = "code-highlight";

    return {
      range,

      options: {
        className,
      },
    };
  };

  const handleMythrilChoose = (finding: MythrilFinding) => {
    const decorationsCollection = [] as monaco.editor.IModelDeltaDecoration[];

    finding.matches.map((match) => {
      if (match.lineno) {
        decorationsCollection.push(createMythrilDecoration(match));
      }
    });

    setCurrentDecoration(decorationsCollection);
  };

  const checklist = result?.mythril.findings
    .filter(
      (finding) =>
        finding.matches.some((match) => match.lineno) ||
        !finding.metadata.duplicated
    )
    .map((finding) => {
      const found = finding.metadata;

      return {
        id: found.id + found.description,
        vulId: found.id,
        severity: found.severity,
        desc: found.description,
        finding,
      };
    });

  return (
    <Box className="checklist-board">
      <Box className={`checklist-board__title checklist-board__title--mythril`}>
        <Typography className="text">
          Sử dụng công cụ Mythril để kiểm tra
        </Typography>

        <a href={MYTHRIL_LINK} className="link" target="_blank">
          <InsertLinkIcon />
        </a>
      </Box>

      <Box className="checklist-board__content">
        <Box className="checklist-board__list">
          {checklist?.map((item) => {
            return (
              <Box
                key={item.id}
                className={`checklist-board__item ${
                  currentChooseId === item.id ? "active--mythril" : ""
                }`}
                onClick={() => {
                  handleMythrilChoose(item.finding);
                  setCurrentChooseId(item.id);
                }}
              >
                <label htmlFor="">
                  <Box className="title">
                    <Severity type={item.severity.toLowerCase()} />
                    <Typography className="title__id">{item.vulId}</Typography>
                  </Box>

                  <Typography className="desc">{item.desc}</Typography>
                </label>
              </Box>
            );
          })}
        </Box>

        <Box className="checklist-board__code-editor">
          <Editor onMount={handleOnMount} value={currentSourceCode} />
        </Box>
      </Box>
    </Box>
  );
};

export default MythrilCheckListBoard;
