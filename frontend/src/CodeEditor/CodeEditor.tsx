import React, { useContext, useEffect, useRef } from "react";

import * as monaco from "monaco-editor";

import { Props } from "./types";
import { Editor } from "@monaco-editor/react";

import "./CodeEditor.scss";
import { ResultContext } from "@/context/ResultContext";

const CodeEditor: React.FC<Props> = ({ code }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const { result } = useContext(ResultContext);

  useEffect(() => {
    const decorations = [] as monaco.editor.IModelDeltaDecoration[];
    result?.semantic_grep.findings.map((find) => {
      find.matches.map((match) => {
        decorations.push({
          range: new monaco.Range(
            match.match_lines[0],
            match.match_position[0],
            match.match_lines[1],
            match.match_position[1]
          ),
          options: {
            hoverMessage: [
              {
                value: `${find.metadata.description}`,
              },
            ],
            className: "myContentClass",
            glyphMarginClassName: "myGlyphMarginClass",
          },
        });
      });
    });
    const decorationsId =
      editorRef.current?.createDecorationsCollection(decorations);
    return () => {
      decorationsId?.clear();
    };
  }, [code]);

  const handleOnMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      value={code}
      options={{
        readOnly: true,
      }}
      defaultLanguage="sol"
      onMount={handleOnMount}
    />
  );
};

export default CodeEditor;
