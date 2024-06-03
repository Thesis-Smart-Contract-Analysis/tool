export type TDetailResult = {
  vulId: string;
  matches: {
    from: number;
    to: number;
    matched: string;
  }[];
  description: string;
  severity: string;
  scanningTool: string;
};

export type TSummaryResult = {
  vulId: string;
  instance: number;
  severity: string;
  scanningTool: string;
};
