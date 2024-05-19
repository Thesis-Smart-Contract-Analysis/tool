/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IResult {
  semantic_grep: SemanticGrep;
  slither: Slither;
  mythril: Mythril;
  full_coverage: boolean;
  scan_time: number;
}

export interface Mythril {
  errors: any[];
  findings: MythrilFinding[];
  scan_time: number;
  success: boolean;
}

export interface MythrilFinding {
  matches: PurpleMatch[];
  metadata: PurpleMetadata;
}

export interface PurpleMatch {
  address: number;
  code?: string;
  contract: string;
  filename?: string;
  function: string;
  lineno?: number;
  max_gas_used: number;
  min_gas_used: number;
  sourceMap: string;
}

export interface PurpleMetadata {
  description: string;
  severity: string;
  id: string;
  title: string;
  "semgrep-id": string;
  duplicated?: boolean;
}

export interface SemanticGrep {
  errors: any[];
  findings: SemanticGrepFinding[];
  scan_time: number;
  success: boolean;
}

export interface SemanticGrepFinding {
  matches: FluffyMatch[];
  metadata: FluffyMetadata;
}

export interface FluffyMatch {
  file_path: string;
  match_position: number[];
  match_lines: number[];
  match_string: string;
}

export interface FluffyMetadata {
  cwe: string;
  references: string[];
  description: string;
  severity: string;
  id: string;
  category?: string;
}

export interface Slither {
  errors: any[];
  findings: SlitherFinding[];
  scan_time: number;
  success: boolean;
}

export interface SlitherFinding {
  matches: TentacledMatch[];
  metadata: TentacledMetadata;
}

export interface TentacledMatch {
  type: string;
  name: string;
  source_mapping: SourceMapping;
  type_specific_fields: MatchTypeSpecificFields;
  additional_fields?: AdditionalFields;
}

export interface AdditionalFields {
  underlying_type: string;
  variable_name?: string;
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

export interface TentacledMetadata {
  description: string;
  id: string;
  severity: string;
  markdown: string;
  first_markdown_element: string;
  confidence: string;
  "semgrep-id"?: string;
  duplicated?: boolean;
}
