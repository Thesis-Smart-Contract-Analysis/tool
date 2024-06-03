import { ReactNode, createContext, useState } from "react";

import { IResult, Mythril, SemanticGrep, Slither } from "@/interfaces";
import { TResultContext } from "@/types";

export const ResultContext = createContext({} as TResultContext);

export const InitResult = {
  mythril: {} as Mythril,
  slither: {} as Slither,
  semantic_grep: {} as SemanticGrep,
  scan_time: 0,
  full_coverage: false,
} as IResult;

const ResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isResultLoading, setIsResultLoading] = useState(false);
  const [isSemgrepResultLoading, setIsSemgrepResultLoading] = useState(false);
  const [isSlitherResultLoading, setIsSlitherResultLoading] = useState(false);
  const [isMythrilResultLoading, setIsMythrilResultLoading] = useState(false);
  const [result, setResult] = useState<IResult | null>(null);
  const [semgrepResult, setSemgrepResult] = useState<SemanticGrep | null>(null);
  const [slitherResult, setSlitherResult] = useState<Slither | null>(null);
  const [mythrilResult, setMythrilResult] = useState<Mythril | null>(null);
  const [currentSourceCode, setCurrentSourceCode] = useState("");
  const [currentFileName, setCurrentFileName] = useState("");

  return (
    <ResultContext.Provider
      value={{
        setResult,
        setIsResultLoading,
        setIsSemgrepResultLoading,
        setIsSlitherResultLoading,
        setIsMythrilResultLoading,
        setCurrentSourceCode,
        setCurrentFileName,
        setSemgrepResult,
        setSlitherResult,
        setMythrilResult,
        isSemgrepResultLoading,
        isSlitherResultLoading,
        isMythrilResultLoading,
        semgrepResult,
        slitherResult,
        mythrilResult,
        result,
        isResultLoading,
        currentSourceCode,
        currentFileName,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export default ResultProvider;
