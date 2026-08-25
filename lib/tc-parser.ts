import { TestCase, ModulePrefix, MODULE_NAMES } from "@/types";
import { TestCaseArraySchema } from "@/lib/schema";

export function parseTCs(jsonString: string): { tcs: TestCase[]; errors: string[] } {
  const errors: string[] = [];
  let raw: unknown;

  try {
    raw = JSON.parse(jsonString);
  } catch {
    return { tcs: [], errors: ["Invalid JSON format"] };
  }

  const result = TestCaseArraySchema.safeParse(raw);
  if (!result.success) {
    return {
      tcs: [],
      errors: result.error.issues.map(
        (i) => `[${i.path.join(".")}] ${i.message}`
      ),
    };
  }

  return { tcs: result.data, errors: [] };
}

export function getModulePrefix(id: string): string {
  const match = id.match(/^([A-Z]+)/);
  return match ? match[1] : "Unknown";
}

export function getModuleName(id: string): string {
  const prefix = getModulePrefix(id);
  return MODULE_NAMES[prefix] || `Module ${prefix}`;
}

export function groupTCsByModule(tcs: TestCase[]): Record<string, TestCase[]> {
  const groups: Record<string, TestCase[]> = {};
  for (const tc of tcs) {
    const module = getModuleName(tc.id);
    if (!groups[module]) groups[module] = [];
    groups[module].push(tc);
  }
  return groups;
}

export function extractUniquePages(tcs: TestCase[]): { page: string; role: string }[] {
  const pages = new Set<string>();
  const result: { page: string; role: string }[] = [];

  const roleMap: Record<string, string> = {
    admin: "admin",
    supervisor: "supervisor",
    hr: "hr",
    finance: "finance",
    user: "user",
  };

  for (const tc of tcs) {
    const preconditions = tc.preconditions.toLowerCase();
    const steps = tc.steps.toLowerCase();

    let role = "admin";
    for (const [key, value] of Object.entries(roleMap)) {
      if (preconditions.includes(key)) {
        role = value;
        break;
      }
    }

    let page = "login";
    if (steps.includes("maintenance")) {
      if (steps.includes("clients")) page = "clients";
      else if (steps.includes("point of contact") || steps.includes("poc")) page = "pocs";
      else if (steps.includes("teams")) page = "teams";
      else if (steps.includes("roster")) page = "roster";
      else if (steps.includes("skills")) page = "skills";
    } else if (steps.includes("timesheets")) {
      if (steps.includes("list of timesheets")) page = "timesheets-list";
      else if (steps.includes("holiday")) page = "holidays";
      else if (steps.includes("builder")) page = "timesheet-builder";
    } else if (steps.includes("team activities")) {
      if (steps.includes("benched")) page = "benched";
      else page = "team-activities";
    } else if (steps.includes("evaluations")) {
      if (steps.includes("my evaluations")) page = "my-evaluations";
      else if (steps.includes("list of evaluations")) page = "list-evaluations";
      else if (steps.includes("pending")) page = "pending-evaluations";
      else if (steps.includes("record history")) page = "record-history";
    } else if (steps.includes("notifications") || steps.includes("bell")) {
      page = "notifications";
    } else if (steps.includes("home") || steps.includes("dashboard") || steps.includes("sidebar")) {
      page = "home";
    }

    const key = `${page}|${role}`;
    if (!pages.has(key)) {
      pages.add(key);
      result.push({ page, role });
    }
  }

  return result;
}
