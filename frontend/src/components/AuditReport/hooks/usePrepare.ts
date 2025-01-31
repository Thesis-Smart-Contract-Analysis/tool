import { useContext, useEffect, useState } from 'react';

import { ResultContext } from '@/context/ResultContext';

import { TDetailResult, TSummaryResult } from '../types';
import { sortBySeverity } from '@/utils/helper';

const usePrepare = () => {
  const { semgrepResult, slitherResult, mythrilResult } =
    useContext(ResultContext);

  const [detailResult, setDetailResult] = useState<TDetailResult[]>([]);
  const [summaryResult, setSummaryResult] = useState<TSummaryResult[]>([]);

  const getInstancesOfVuln = (sortedResult: TDetailResult[]) => {
    const summaryRes = [] as TSummaryResult[];
    const countDuplicatedVuln: Record<string, number> = {};

    sortedResult?.forEach((res) => {
      const key = `${res.severity}-${res.vulnId}-${res.scanningTool}`;
      countDuplicatedVuln[key] = (countDuplicatedVuln[key] || 0) + 1;
    });

    sortedResult?.forEach((res) => {
      const key = `${res.severity}-${res.vulnId}-${res.scanningTool}`;
      if (countDuplicatedVuln[key] >= 1) {
        summaryRes.push({
          scanningTool: res.scanningTool,
          severity: res.severity,
          vulnId: res.vulnId,
          instance: countDuplicatedVuln[key],
        });

        countDuplicatedVuln[key] = 0;
      }
    });

    return summaryRes;
  };

  useEffect(() => {
    const semgrep = semgrepResult?.findings.map((finding) => {
      return {
        vulnId: finding.metadata.name || finding.metadata.id,
        matches: [...finding.matches].map((match) => {
          const from = match.start.line;
          const to = match.end.line;

          return {
            from,
            to,
            line: from === to ? from : undefined,
            matched: `${match.lines.trim()}`,
          };
        }),
        description: finding.metadata.message,
        severity: finding.metadata.severity,
        scanningTool: 'So1Scan',
      };
    });

    const slither = slitherResult?.findings
      ?.filter((finding) => !finding.metadata.duplicated)
      .map((finding) => {
        return {
          vulnId: finding.metadata.id,
          matches: [...finding.matches].map((match) => {
            const from = match.source_mapping.lines[0];
            const to =
              match.source_mapping.lines[match.source_mapping.lines.length - 1];

            return {
              from,
              to,
              line: from === to ? from : undefined,
              type: match.type !== 'node' ? match.type.trim() : undefined,
              matched: match.name.trim(),
            };
          }),
          description: finding.metadata.description,
          severity: finding.metadata.severity,
          scanningTool: 'Slither',
        };
      });

    const mythril = mythrilResult?.findings
      ?.filter((finding) => {
        return (
          !finding.metadata.duplicated &&
          finding.matches.some((match) => match.lineno)
        );
      })
      .map((finding) => {
        return {
          vulnId: finding.metadata.title,
          matches: [...finding.matches].map((match) => {
            const from = match.lineno;
            const to = match.lineno;

            return {
              from,
              to,
              line: from === to ? from : undefined,
              matched: `${match.code.trim()}`,
            };
          }),
          description: finding.metadata.description,
          severity: finding.metadata.severity,
          scanningTool: 'Mythril',
        };
      });

    if (semgrep && slither && mythril) {
      const sortedResult = sortBySeverity([
        ...semgrep,
        ...slither,
        ...mythril,
      ]) as TDetailResult[];

      const summaryRes = getInstancesOfVuln(sortedResult);

      setSummaryResult(summaryRes);

      setDetailResult(sortedResult);
    }
  }, [semgrepResult, slitherResult, mythrilResult]);

  return {
    summaryResult,
    detailResult,
  };
};

export default usePrepare;
