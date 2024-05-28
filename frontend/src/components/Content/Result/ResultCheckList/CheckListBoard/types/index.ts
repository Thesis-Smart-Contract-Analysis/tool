import {
  MythrilFinding,
  SemanticGrepFinding,
  SlitherFinding,
} from "@/interfaces";

export type TCheckList = {
  id: string;
  vulId: string;
  severity: string;
  desc: string;
  finding: SemanticGrepFinding | SlitherFinding | MythrilFinding;
};
