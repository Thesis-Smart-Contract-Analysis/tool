import React, { useContext, useEffect, useRef, useState } from "react";

import { Editor, OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Severity from "@/components/Severity/Severity";
import { ResultContext } from "@/context/ResultContext";
import { SlitherFinding, SlitherMatch } from "@/interfaces";

const SlitherCheckListBoard: React.FC = () => {
  const { result, currentSourceCode } = useContext(ResultContext);

  const [currentDecoration, setCurrentDecoration] =
    useState<monaco.editor.IModelDeltaDecoration[]>();

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

    const className = "highlight";

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
      <Typography
        className={`checklist-board__title checklist-board__title--slither`}
      >
        Slither
      </Typography>

      <Box className="checklist-board__content">
        <Box className="checklist-board__list">
          {checklist?.map((item) => {
            return (
              <Box
                key={item.id}
                className={`checklist-board__item checklist-board__item--slither`}
                onClick={() => {
                  handleSlitherChoose(item.finding);
                }}
              >
                <Box className="title">
                  <Severity type={item.severity.toLowerCase()} />
                  <Typography className="title__id">{item.vulId}</Typography>
                </Box>

                <Typography className="desc">{item.desc}</Typography>
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
