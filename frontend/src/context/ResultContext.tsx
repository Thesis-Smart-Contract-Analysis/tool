import { ReactNode, createContext, useState } from 'react';

import { IResult, Mythril, SemanticGrep, Slither } from '@/interfaces';
import { TResultContext } from '@/types';
import {
  SAMPLE_MYTHRIL_RESULT,
  SAMPLE_SEMGREP_RESULT,
  SAMPLE_SLITHER_RESULT,
} from '@/utils/constant';

export const ResultContext = createContext({} as TResultContext);

export const InitResult = {
  mythril: {} as Mythril,
  slither: {} as Slither,
  semantic_grep: {} as SemanticGrep,
  scan_time: 0,
  success: false,
} as IResult;

const ResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isResultLoading, setIsResultLoading] = useState(false);
  const [isSemgrepResultLoading, setIsSemgrepResultLoading] = useState(false);
  const [isSlitherResultLoading, setIsSlitherResultLoading] = useState(false);
  const [isMythrilResultLoading, setIsMythrilResultLoading] = useState(false);
  const [result, setResult] = useState<IResult | null>(null);
  const [isScanWithChatGPT, setIsScanWithChatGPT] = useState(false);
  const [semgrepResult, setSemgrepResult] = useState<SemanticGrep | null>(
    SAMPLE_SEMGREP_RESULT,
  );
  const [slitherResult, setSlitherResult] = useState<Slither | null>(
    SAMPLE_SLITHER_RESULT,
  );
  const [mythrilResult, setMythrilResult] = useState<Mythril | null>(
    SAMPLE_MYTHRIL_RESULT,
  );
  const [currentSourceCode, setCurrentSourceCode] = useState('');
  const [currentFileName, setCurrentFileName] = useState('');

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
        setIsScanWithChatGPT,
        isScanWithChatGPT,
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
