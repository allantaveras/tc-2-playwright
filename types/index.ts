export interface TestCase {
  id: string;
  scenario: string;
  test_case: string;
  preconditions: string;
  steps: string;
  expected: string;
  sheet?: string;
}

export interface Credentials {
  [role: string]: {
    username: string;
    password: string;
  };
}

export interface SelectorMap {
  [pageName: string]: {
    [elementName: string]: string;
  };
}

export interface ExplorationResult {
  pageName: string;
  role: string;
  selectors: Record<string, string>;
  status: "pending" | "running" | "completed" | "failed";
  error?: string;
}

export interface GenerationOptions {
  targetUrl: string;
  includePOMs: boolean;
  includeAllure: boolean;
  includeStagehand: boolean;
}

export interface TestRunResult {
  tcId: string;
  status: "passed" | "failed" | "skipped" | "broken";
  duration: number;
  error?: string;
  screenshot?: string;
  video?: string;
}

export interface ModuleMetrics {
  module: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
}

export interface ReportSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  broken: number;
  passRate: number;
  duration: number;
  byModule: ModuleMetrics[];
  tests: TestRunResult[];
}

export type ModulePrefix =
  | "L" | "H" | "N" | "C" | "P" | "T" | "R" | "S"
  | "M" | "B" | "HO" | "TB" | "ME" | "LE" | "PE" | "RH";

export const MODULE_NAMES: Record<string, string> = {
  L: "Login",
  H: "Home / Dashboard",
  N: "Notifications",
  C: "Clients",
  P: "Point of Contact",
  T: "Teams",
  R: "Roster",
  S: "Skills",
  M: "Team Activities",
  B: "Benched Employees",
  HO: "Holiday Maintenance",
  TB: "Timesheet Builder",
  ME: "My Evaluations",
  LE: "List of Evaluations",
  PE: "Pending Evaluations",
  RH: "Record History",
};
