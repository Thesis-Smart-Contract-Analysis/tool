import * as monaco from 'monaco-editor';

import { SemanticGrepFinding, SemanticGrepMatch } from '@/interfaces';

export const useSo1Scan = (
  setCurrentDecoration: React.Dispatch<
    React.SetStateAction<monaco.editor.IModelDeltaDecoration[] | undefined>
  >,
) => {
  const createSo1ScanDecoration = (
    find: SemanticGrepFinding,
    match: SemanticGrepMatch,
  ) => {
    const start_line = match.start.line;
    const start_col = match.start.col;
    const end_line = match.end.line;
    const end_col = match.end.col;

    const range = new monaco.Range(start_line, start_col, end_line, end_col);

    const message = `⚠️ **\`${find.metadata.id.toLocaleUpperCase()}\`** - ${
      find.metadata.message
    }`;

    const className = 'code-highlight';

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

  return {
    createSo1ScanDecoration,
    handleSo1ScanChoose,
  };
};
