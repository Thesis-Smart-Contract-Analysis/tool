import * as monaco from 'monaco-editor';

import { MythrilFinding, MythrilMatch } from '@/interfaces';

export const useMythril = (
  setCurrentDecoration: React.Dispatch<
    React.SetStateAction<monaco.editor.IModelDeltaDecoration[] | undefined>
  >,
) => {
  const createMythrilDecoration = (match: MythrilMatch) => {
    const start_line = match.lineno as number;
    const start_col = 1;
    const end_line = match.lineno as number;
    const end_col = 100;

    const range = new monaco.Range(start_line, start_col, end_line, end_col);

    const className = 'code-highlight';

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

  return {
    createMythrilDecoration,
    handleMythrilChoose,
  };
};
