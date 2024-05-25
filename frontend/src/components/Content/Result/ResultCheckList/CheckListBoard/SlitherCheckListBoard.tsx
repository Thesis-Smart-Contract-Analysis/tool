import React, { useContext, useEffect, useRef, useState } from "react";

import { Editor, OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import Box from "@mui/material/Box";
import InsertLinkIcon from "@mui/icons-material/InsertLink";

import Typography from "@mui/material/Typography";

import Severity from "@/components/Severity/Severity";
import { ResultContext } from "@/context/ResultContext";
import { SlitherFinding, SlitherMatch } from "@/interfaces";
import { SLITHER_LINK } from "@/utils/constant";

const SlitherCheckListBoard: React.FC = () => {
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

  const createSlitherDecoration = (match: SlitherMatch) => {
    const start_line = match.source_mapping.lines[0];
    const start_col = match.source_mapping.starting_column;
    const end_line =
      match.source_mapping.lines[match.source_mapping.lines.length - 1];
    const end_col = match.source_mapping.ending_column;

    const range = new monaco.Range(start_line, start_col, end_line, end_col);

    const className = "code-highlight";

    return {
      range,
      options: {
        className,
      },
    };
  };

  const handleSlitherChoose = (finding: SlitherFinding) => {
    const match = finding.matches[finding.matches.length - 1];

    if (match) {
      setCurrentDecoration([createSlitherDecoration(match)]);
    }
  };

  const checklist = result?.slither.findings.map((finding) => {
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
      <Box className={`checklist-board__title checklist-board__title--slither`}>
        <Typography className="text">
          Sử dụng công cụ Slither để kiểm tra
        </Typography>

        <a href={SLITHER_LINK} className="link" target="_blank">
          <InsertLinkIcon />
        </a>
      </Box>

      <Box className="checklist-board__content">
        <Box className="checklist-board__list">
          {checklist?.map((item) => {
            return (
              <Box
                key={item.id}
                className={`checklist-board__item  ${
                  currentChooseId === item.id ? "active--slither" : ""
                }`}
                onClick={() => {
                  handleSlitherChoose(item.finding);
                  setCurrentChooseId(item.id);
                }}
              >
                <input
                  type="checkbox"
                  id={item.id}
                  style={{
                    display: "none",
                  }}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleSlitherChoose(item.finding);
                    }
                  }}
                />
                <label htmlFor={item.id}>
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

export default SlitherCheckListBoard;
