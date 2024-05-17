export interface IResult {
  semantic_grep: SemanticGrep;
  slither: Slither;
  mythril: Mythril;
}

export interface Mythril {
  errors: object[];
  findings: MythrilFinding[];
  success: boolean;
}

export interface MythrilFinding {
  matches: PurpleMatch[];
  metadata: PurpleMetadata;
}

export interface PurpleMatch {
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

export interface PurpleMetadata {
  description: string;
  severity: string;
  'swc-id': string;
  title: string;
}

export interface SemanticGrep {
  errors: object[];
  findings: SemanticGrepFinding[];
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
  category?: string;
  cwe: string;
  references: string[] | string;
  description: string;
  severity: string;
  id: string;
}

export interface Slither {
  errors: object[];
  findings: SlitherFinding[];
  success: boolean;
}

export interface SlitherFinding {
  matches: ParentElement[];
  metadata: TentacledMetadata;
}

export interface PurpleTypeSpecificFields {
  parent: ParentElement;
  signature: string;
}

export interface Parent {
  type: string;
  name: string;
  source_mapping: SourceMapping;
  type_specific_fields?: PurpleTypeSpecificFields;
}

export interface MatchTypeSpecificFields {
  parent: Parent;
  signature?: string;
}

export interface ParentElement {
  type: string;
  name: string;
  source_mapping: SourceMapping;
  type_specific_fields?: MatchTypeSpecificFields;
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

export interface TentacledMetadata {
  description: string;
  id: string;
  severity: string;
  markdown: string;
  first_markdown_element: string;
  confidence: string;
}
