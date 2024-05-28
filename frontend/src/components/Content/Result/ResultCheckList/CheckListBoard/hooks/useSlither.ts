import * as monaco from "monaco-editor";

import { SlitherFinding, SlitherMatch } from "@/interfaces";

export const useSlither = (
  setCurrentDecoration: React.Dispatch<
    React.SetStateAction<monaco.editor.IModelDeltaDecoration[] | undefined>
  >
) => {
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

  return {
    createSlitherDecoration,
    handleSlitherChoose,
  };
};
