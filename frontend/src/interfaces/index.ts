/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IResult {
  semantic_grep: SemanticGrep;
  slither: Slither;
  mythril: Mythril;
  scan_time: number;
  success: boolean;
  smart_contract_name: string;
}

export interface Mythril {
  errors: any;
  findings: MythrilFinding[];
  scan_time: number;
  success: boolean;
}

export interface MythrilFinding {
  matches: MythrilMatch[];
  metadata: MythrilMetadata;
}

export interface MythrilMatch {
  address: number;
  code: string;
  contract: string;
  filename: string;
  function: string;
  lineno: number;
  max_gas_used: number;
  min_gas_used: number;
  sourceMap: string;
}

export interface MythrilMetadata {
  description: string;
  severity: string;
  id: string;
  title: string;
  'semgrep-id': string;
  duplicated: boolean;
}

export interface SemanticGrep {
  errors: any;
  findings: SemanticGrepFinding[];
  scan_time: number;
  success: boolean;
}

export interface SemanticGrepFinding {
  matches: SemanticGrepMatch[];
  metadata: SemanticGrepMetadata;
}

export interface SemanticGrepMatch {
  path: string;
  start: End;
  end: End;
  lines: string;
}

export interface End {
  col: number;
  line: number;
  offset: number;
}

export interface SemanticGrepMetadata {
  cwe?: string;
  references: string[];
  message: string;
  severity: string;
  id: string;
  category?: string;
  name?: string;
}

export interface Slither {
  errors: any;
  findings: SlitherFinding[];
  scan_time: number;
  success: boolean;
}

export interface SlitherFinding {
  matches: SlitherMatch[];
  metadata: SlitherMetadata;
}

export interface SlitherMatch {
  type: string;
  name: string;
  source_mapping: SourceMapping;
  type_specific_fields: MatchTypeSpecificFields;
  additional_fields?: AdditionalFields;
}

export interface AdditionalFields {
  convention?: string;
  target?: string;
}

export interface SourceMapping {
  start: number;
  length: number;
  filename_relative: string;
  filename_absolute: string;
  filename_short: string;
  is_dependency: boolean;
  lines: number[];
  starting_column: number;
  ending_column: number;
}

export interface MatchTypeSpecificFields {
  parent?: Parent;
  signature?: string;
  directive?: string[];
}

export interface ParentTypeSpecificFields {
  parent: Parent;
  signature: string;
}

export interface Parent {
  type: string;
  name: string;
  source_mapping: SourceMapping;
  type_specific_fields?: ParentTypeSpecificFields;
}

export interface SlitherMetadata {
  description: string;
  id: string;
  severity: string;
  markdown: string;
  first_markdown_element: string;
  confidence: string;
  'semgrep-id'?: string;
  duplicated: boolean;
}
