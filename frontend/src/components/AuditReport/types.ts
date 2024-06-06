export type TDetailResult = {
  vulnId: string;
  matches: {
    from: number;
    to: number;
    line?: number;
    type?: string;
    matched: string;
  }[];
  description: string;
  severity: string;
  scanningTool: string;
};

export type TSummaryResult = {
  vulnId: string;
  instance: number;
  severity: string;
  scanningTool: string;
};
