export type AgentCluster =
  | "GOVERNANCE"
  | "FORENSIC_LEGAL"
  | "CAREER_EXECUTIVE"
  | "WLC_BUSINESS"
  | "PERSONAL_LIFE"
  | "TECH_ASSETS";

export interface AgentDefinition {
  id: string;
  number: number;
  name: string;
  shortTitle: string;
  cluster: AgentCluster;
  clusterLabel: string;
  role: string;
  logicalSolution: string;
  guardrails: string[];
  learningLoop: string;
  twoColumnRequirements: string;
  inputsDescription: string;
  outputsDescription: string;
  sharpForkStrategy: {
    safe: string;
    bold: string;
    disruptive: string;
  };
  systemPrompt: string;
  defaultPromptExample: string;
  talksToDayna: boolean;
  isEphemeral: boolean;
  domainLock?: string;
  bannedWords?: string[];
  sampleVerifiedSources?: string[];
}

export interface SharpForkOption {
  type: "SAFE" | "BOLD" | "DISRUPTIVE";
  title: string;
  description: string;
  actionPlan: string;
  confidence: number;
}

export interface TwoColumnItem {
  claim: string;
  sourcePath: string;
  verified: boolean;
  notes?: string;
}

export interface RubricEvaluation {
  kolbeCongruence: number; // 0-100 (target >= 80)
  toneMatch: number; // 0-100 (target >= 80)
  actionability: number; // 0-100 (target >= 80)
  surpriseFactor: number; // 0-100 (target >= 80)
  overallScore: number;
  passedThreshold: boolean;
  critiqueNotes?: string[];
}

export interface SimulationResult {
  agentId: string;
  agentName: string;
  status: "COMPLETED" | "ERROR" | "REWRITING";
  executionMode: string;
  outputContent: string;
  sharpForks: SharpForkOption[];
  twoColumnProvenance: TwoColumnItem[];
  rubricScores: RubricEvaluation;
}

export interface RollingMemoryItem {
  id: string;
  axiom: string;
  domain: string;
  sourceAgent: string;
  status: "ACTIVE" | "ARCHIVED";
  dateCommitted: string;
  rubricScore: number;
}

export interface MCPToolDef {
  name: string;
  description: string;
  category: "FILE_IO" | "MEMORY" | "EVIDENCE" | "ROUTING" | "DOMAIN";
  inputSchema: Record<string, any>;
  examplePayload: Record<string, any>;
  returnSchema: Record<string, any>;
}

export interface LegalDomainDef {
  id: string;
  code: string;
  title: string;
  r2Prefix: string;
  description: string;
  isolatedFrom: string[];
  allowedTypes: string[];
}
