import React, { useContext, useMemo } from "react";

import * as monaco from "monaco-editor";
import Editor from "@monaco-editor/react";

import { ResultContext } from "@/context/ResultContext";
import { RESULT_TYPE } from "@/enums";
import {
  SemanticGrepMatch,
  MythrilFinding,
  MythrilMatch,
  SemanticGrepFinding,
  SlitherFinding,
  SlitherMatch,
} from "@/interfaces";

import "./ResultHighLight.scss";

const createSemgrepDecoration = (
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

const createSlitherDecoration = (find: SlitherFinding, match: SlitherMatch) => {
  const start_line = match.source_mapping.lines[0];
  const start_col = match.source_mapping.starting_column;
  const end_line =
    match.source_mapping.lines[match.source_mapping.lines.length - 1];
  const end_col = match.source_mapping.ending_column;

  const range = new monaco.Range(start_line, start_col, end_line, end_col);

  const message = `⚠️ **\`${
    find.metadata["semgrep-id"]?.toLocaleUpperCase() ||
    find.metadata.id.toLocaleUpperCase()
  }\`** - ${find.metadata.markdown}`;

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

const createMythrilDecoration = (find: MythrilFinding, match: MythrilMatch) => {
  const start_line = match.lineno as number;
  const start_col = 1;
  const end_line = match.lineno as number;
  const end_col = 100;

  const range = new monaco.Range(start_line, start_col, end_line, end_col);

  const message = `⚠️ **\`${
    find.metadata["semgrep-id"]?.toLocaleUpperCase() ||
    find.metadata.id.toLocaleUpperCase()
  }\`** - ${find.metadata.description}`;

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

const ResultHighLight: React.FC<{ type: RESULT_TYPE }> = ({ type }) => {
  const { result, currentSourceCode } = useContext(ResultContext);

  const decorations = useMemo(() => {
    const decorationsCollection = [] as monaco.editor.IModelDeltaDecoration[];

    if (type === RESULT_TYPE.SO1SCAN) {
      result?.semantic_grep.findings.map((find) => {
        find.matches.map((match) => {
          decorationsCollection.push(createSemgrepDecoration(find, match));
        });
      });
    } else if (type === RESULT_TYPE.SLITHER) {
      result?.slither.findings.map((finding) => {
        // Get last match in finding because this match is a final result of current finding, every match before the last match show the parents of the last match
        const match = finding.matches[finding.matches.length - 1];

        if (match) {
          decorationsCollection.push(createSlitherDecoration(finding, match));
        }
      });
    } else {
      result?.mythril.findings.map((find) => {
        find.matches.map((match) => {
          decorationsCollection.push(createMythrilDecoration(find, match));
        });
      });
    }

    return decorationsCollection;
  }, [result, type]);

  const handleOnMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editor.createDecorationsCollection(decorations);
  };

  return (
    <Editor
      defaultValue={currentSourceCode}
      defaultLanguage="sol"
      onMount={handleOnMount}
      options={{
        readOnly: true,
      }}
    />
  );
};

export default ResultHighLight;
