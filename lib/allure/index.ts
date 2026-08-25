import * as fs from "fs";
import * as path from "path";
import { ReportSummary, ModuleMetrics, TestRunResult } from "@/types";

export interface AllureTestCase {
  name: string;
  status: "passed" | "failed" | "skipped" | "broken";
  duration: number;
  fullName?: string;
  testId?: string;
  labels?: { name: string; value: string }[];
  steps?: AllureStep[];
  parameters?: { name: string; value: string }[];
  attachments?: AllureAttachment[];
}

export interface AllureStep {
  name: string;
  status: string;
  steps?: AllureStep[];
}

export interface AllureAttachment {
  name: string;
  source: string;
  type: string;
}

export interface AllureContainer {
  uuid: string;
  children: string[];
  befores: any[];
  afters: any[];
  name: string;
}

export function readAllureResults(allureDir: string): AllureTestCase[] {
  const testCases: AllureTestCase[] = [];

  if (!fs.existsSync(allureDir)) return testCases;

  try {
    const files = fs.readdirSync(allureDir).filter(f => f.endsWith("-result.json"));
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(allureDir, file), "utf-8");
        const data = JSON.parse(content);
        testCases.push({
          name: data.name || "Unknown",
          status: (data.status || "broken").toLowerCase() as any,
          duration: data.stop && data.start ? data.stop - data.start : 0,
          fullName: data.fullName,
          labels: data.labels || [],
          steps: data.steps || [],
          parameters: data.parameters || [],
          attachments: (data.attachments || []).map((a: any) => ({
            name: a.name || "",
            source: a.source || "",
            type: a.type || "",
          })),
        });
      } catch {}
    }
  } catch {}

  return testCases;
}

export function buildReportSummary(allureDir: string): ReportSummary {
  const testCases = readAllureResults(allureDir);
  const moduleMap: Record<string, { total: number; passed: number; failed: number; skipped: number; broken: number }> = {};
  const tests: TestRunResult[] = [];

  for (const tc of testCases) {
    const label = tc.labels?.find(l => l.name === "suite");
    const module = extractModule(tc.fullName || tc.name);
    const tcId = extractTCId(tc.name);

    tests.push({
      tcId: tcId || tc.name,
      status: tc.status,
      duration: tc.duration,
      error: tc.steps?.find(s => s.status === "failed")?.name,
    });

    if (!moduleMap[module]) {
      moduleMap[module] = { total: 0, passed: 0, failed: 0, skipped: 0, broken: 0 };
    }
    moduleMap[module].total++;
    if (tc.status === "passed") moduleMap[module].passed++;
    else if (tc.status === "failed") moduleMap[module].failed++;
    else if (tc.status === "skipped") moduleMap[module].skipped++;
    else if (tc.status === "broken") moduleMap[module].broken++;
  }

  const total = testCases.length;
  const passed = testCases.filter(t => t.status === "passed").length;
  const failed = testCases.filter(t => t.status === "failed").length;
  const skipped = testCases.filter(t => t.status === "skipped").length;
  const broken = testCases.filter(t => t.status === "broken").length;

  return {
    total,
    passed,
    failed,
    skipped,
    broken,
    passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
    duration: testCases.reduce((sum, t) => sum + t.duration, 0),
    byModule: Object.entries(moduleMap).map(([module, data]) => ({
      module,
      ...data,
      passRate: data.total > 0 ? Math.round((data.passed / data.total) * 100) : 0,
    })),
    tests,
  };
}

function extractModule(name: string): string {
  const prefix = name.match(/^([A-Z]+)/)?.[1] || "";
  const moduleMap: Record<string, string> = {
    L: "Login", H: "Home", N: "Notifications", C: "Clients",
    P: "POC", T: "Teams", R: "Roster", S: "Skills",
    M: "Team Activities", B: "Benched", HO: "Holidays",
    TB: "Timesheet Builder", ME: "My Evaluations",
    LE: "List Evaluations", PE: "Pending Evaluations", RH: "Record History",
  };
  return moduleMap[prefix] || "Other";
}

function extractTCId(name: string): string {
  const match = name.match(/([A-Z]+-\d+)/);
  return match ? match[1] : "";
}

export function getTCReport(allureDir: string, tcId: string): AllureTestCase | null {
  const testCases = readAllureResults(allureDir);
  return testCases.find(tc => (tc.fullName || tc.name).includes(tcId)) || null;
}

export function getScreenshotPath(allureDir: string, attachmentSource: string): string {
  const screenshotPath = path.join(allureDir, attachmentSource);
  return fs.existsSync(screenshotPath) ? screenshotPath : "";
}
