import { TCheckList } from "@/types";
import { SEVERITY_PRIORITY } from "./constant";

export const sortCheckListBySeverity = (
  checklist: TCheckList[] | undefined
) => {
  if (checklist) {
    const sortedChecklist = JSON.parse(
      JSON.stringify(checklist)
    ) as TCheckList[];

    sortedChecklist?.sort(
      (a, b) =>
        SEVERITY_PRIORITY.indexOf(b.severity) -
        SEVERITY_PRIORITY.indexOf(a.severity)
    );
    return sortedChecklist;
  }

  return checklist;
};
