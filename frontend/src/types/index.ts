/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IResult,
  Mythril,
  MythrilFinding,
  SemanticGrep,
  SemanticGrepFinding,
  Slither,
  SlitherFinding,
} from '@/interfaces';

export type TCheckList = {
  id: string;
  vulId: string;
  severity: string;
  desc: string;
  finding: SemanticGrepFinding | SlitherFinding | MythrilFinding;
};

export type TResultContext = {
  result: IResult | null;
  setResult: React.Dispatch<React.SetStateAction<IResult | null>>;
  semgrepResult: SemanticGrep | null;
  setSemgrepResult: React.Dispatch<React.SetStateAction<SemanticGrep | null>>;
  slitherResult: Slither | null;
  setSlitherResult: React.Dispatch<React.SetStateAction<Slither | null>>;
  mythrilResult: Mythril | null;
  setMythrilResult: React.Dispatch<React.SetStateAction<Mythril | null>>;
  isResultLoading: boolean;
  setIsResultLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSemgrepResultLoading: boolean;
  setIsSemgrepResultLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSlitherResultLoading: boolean;
  setIsSlitherResultLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isMythrilResultLoading: boolean;
  setIsMythrilResultLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentSourceCode: string;
  setCurrentSourceCode: React.Dispatch<React.SetStateAction<string>>;
  currentFileName: string;
  setCurrentFileName: React.Dispatch<React.SetStateAction<string>>;
  setIsScanWithChatGPT: React.Dispatch<React.SetStateAction<boolean>>;
  isScanWithChatGPT: boolean;
};
