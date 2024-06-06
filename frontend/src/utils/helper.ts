/* eslint-disable @typescript-eslint/no-explicit-any */
import { SEVERITY_PRIORITY } from './constant';

export const sortBySeverity = (checklist: any[] | undefined) => {
  if (checklist) {
    const sortedResult = JSON.parse(JSON.stringify(checklist));

    sortedResult?.sort(
      (a: any, b: any) =>
        SEVERITY_PRIORITY.indexOf(b.severity) -
        SEVERITY_PRIORITY.indexOf(a.severity),
    );
    return sortedResult;
  }

  return checklist;
};
