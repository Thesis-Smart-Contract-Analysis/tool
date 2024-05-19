import { ReactNode, createContext, useState } from "react";

import { IResult } from "@/interfaces";
import { TResultContext } from "@/types";

export const ResultContext = createContext({} as TResultContext);

const ResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isResultLoading, setIsResultLoading] = useState(false);
  const [result, setResult] = useState<IResult | null>(null);
  const [currentSourceCode, setCurrentSourceCode] = useState("");

  return (
    <ResultContext.Provider
      value={{
        setResult,
        setIsResultLoading,
        setCurrentSourceCode,
        result,
        isResultLoading,
        currentSourceCode,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export default ResultProvider;
