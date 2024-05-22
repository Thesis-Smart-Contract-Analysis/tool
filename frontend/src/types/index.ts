import { IResult } from '@/interfaces';

export type TResultContext = {
  result: IResult | null;
  setResult: React.Dispatch<React.SetStateAction<IResult | null>>;
  isResultLoading: boolean;
  setIsResultLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentSourceCode: string;
  setCurrentSourceCode: React.Dispatch<React.SetStateAction<string>>;
};
