import { TestRunResult, ReportSummary, ModuleMetrics } from "@/types";
import { execSync, spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";

export interface RunOptions {
  projectDir: string;
  testPattern?: string;
  timeout?: number;
}

export async function runTests(options: RunOptions): Promise<ReportSummary> {
  const { projectDir, testPattern, timeout = 300000 } = options;

  const results: TestRunResult[] = [];
  const allureDir = path.join(projectDir, "allure-results");

  if (!fs.existsSync(allureDir)) {
    fs.mkdirSync(allureDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const args = ["playwright", "test"];
    if (testPattern) args.push("--grep", testPattern);
    args.push("--reporter", "json,allure-playwright");

    const child = spawn("npx", args, {
      cwd: projectDir,
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    const timeoutId = setTimeout(() => {
      child.kill();
      reject(new Error("Test run timed out"));
    }, timeout);

    child.on("close", (code) => {
      clearTimeout(timeoutId);
      try {
        const summary = parsePlaywrightOutput(stdout);
        const allureResults = parseAllureResults(allureDir);

        const merged: ReportSummary = {
          total: summary.total || allureResults.total,
          passed: summary.passed || allureResults.passed,
          failed: summary.failed || allureResults.failed,
          skipped: summary.skipped || allureResults.skipped,
          broken: allureResults.broken || 0,
          passRate: 0,
          duration: summary.duration || 0,
          byModule: [],
          tests: summary.tests || [],
        };

        merged.passRate = merged.total > 0
          ? Math.round((merged.passed / merged.total) * 100)
          : 0;

        resolve(merged);
      } catch (err) {
        resolve({
          total: 0,
          passed: 0,
          failed: 0,
          skipped: 0,
          broken: 0,
          passRate: 0,
          duration: 0,
          byModule: [],
          tests: [],
        });
      }
    });

    child.stderr.on("data", (data) => {});
  });
}

function parsePlaywrightOutput(output: string): Partial<ReportSummary> {
  try {
    const lines = output.split("\n");
    let total = 0, passed = 0, failed = 0, skipped = 0;
    const tests: TestRunResult[] = [];

    for (const line of lines) {
      const match = line.match(/(✓|×|•)\s+(.+?)\s+\((\d+)ms\)/);
      if (match) {
        const status = match[1] === "✓" ? "passed" : match[1] === "×" ? "failed" : "skipped";
        total++;
        if (status === "passed") passed++;
        else if (status === "failed") failed++;
        else skipped++;

        tests.push({
          tcId: match[2].trim(),
          status: status as any,
          duration: parseInt(match[3]),
        });
      }
    }

    return { total, passed, failed, skipped, tests };
  } catch {
    return {};
  }
}

function parseAllureResults(allureDir: string): {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  broken: number;
} {
  const result = { total: 0, passed: 0, failed: 0, skipped: 0, broken: 0 };

  if (!fs.existsSync(allureDir)) return result;

  try {
    const files = fs.readdirSync(allureDir).filter(f => f.endsWith("-result.json"));
    for (const file of files) {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(allureDir, file), "utf-8"));
        result.total++;
        const status = (content.status || "").toLowerCase();
        if (status === "passed") result.passed++;
        else if (status === "failed") result.failed++;
        else if (status === "skipped") result.skipped++;
        else if (status === "broken") result.broken++;
      } catch { }
    }
  } catch { }

  return result;
}

export function computeModuleMetrics(tests: TestRunResult[]): ModuleMetrics[] {
  const moduleMap: Record<string, { total: number; passed: number; failed: number; skipped: number }> = {};

  for (const test of tests) {
    const prefix = test.tcId.match(/^([A-Z]+)/)?.[1] || "Unknown";
    if (!moduleMap[prefix]) {
      moduleMap[prefix] = { total: 0, passed: 0, failed: 0, skipped: 0 };
    }
    moduleMap[prefix].total++;
    if (test.status === "passed") moduleMap[prefix].passed++;
    else if (test.status === "failed") moduleMap[prefix].failed++;
    else if (test.status === "skipped") moduleMap[prefix].skipped++;
  }

  return Object.entries(moduleMap).map(([module, data]) => ({
    module,
    ...data,
    passRate: data.total > 0 ? Math.round((data.passed / data.total) * 100) : 0,
  }));
}
