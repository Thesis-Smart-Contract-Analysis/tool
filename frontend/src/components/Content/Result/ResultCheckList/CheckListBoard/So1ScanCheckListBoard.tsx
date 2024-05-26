import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import * as monaco from "monaco-editor";
import { Editor, OnMount } from "@monaco-editor/react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { SemanticGrepFinding, SemanticGrepMatch } from "@/interfaces";
import { ResultContext } from "@/context/ResultContext";
import Severity from "@/components/Severity/Severity";

const So1ScanCheckListBoard = () => {
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

  const createSo1ScanDecoration = (
    find: SemanticGrepFinding,
    match: SemanticGrepMatch
  ) => {
    const start_line = match.start.line;
    const start_col = match.start.col;
    const end_line = match.end.line;
    const end_col = match.end.col;

    const range = new monaco.Range(start_line, start_col, end_line, end_col);

    const message = `⚠️ **\`${find.metadata.id.toLocaleUpperCase()}\`** - ${
      find.metadata.message
    }`;

    const className = "code-highlight";

    return {
      range,

      options: {
        hoverMessage: {
          value: message,
        },

        className,
      },
    };
  };

  const handleSo1ScanChoose = (finding: SemanticGrepFinding) => {
    const decorationsCollection = [] as monaco.editor.IModelDeltaDecoration[];

    finding.matches.map((match) => {
      decorationsCollection.push(createSo1ScanDecoration(finding, match));
    });

    setCurrentDecoration(decorationsCollection);
  };

  const checklist = useMemo(
    () =>
      result?.semantic_grep.findings.map((finding) => {
        const found = finding.metadata;

        return {
          id: uuidv4(),
          vulId: found.name,
          severity: found.severity,
          desc: found.message,
          finding,
        };
      }),
    [result]
  );

  return (
    <Box className="checklist-board">
      <Box className="checklist-board__content">
        <Box className="checklist-board__list">
          {checklist?.map((item) => {
            return (
              <Box
                key={item.id}
                className={`checklist-board__item ${
                  currentChooseId === item.id ? "active--so1scan" : ""
                }`}
                onClick={() => {
                  handleSo1ScanChoose(item.finding);
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

export default So1ScanCheckListBoard;
