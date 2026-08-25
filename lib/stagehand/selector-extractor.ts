import { TestCase } from "@/types";

export interface ParsedStep {
  action: "click" | "fill" | "select" | "validate" | "navigate" | "check" | "uncheck";
  target: string;
  value?: string;
}

export function parseSteps(steps: string): ParsedStep[] {
  const parsed: ParsedStep[] = [];
  const lines = steps.split("\n");

  for (const line of lines) {
    const trimmed = line.replace(/^\d+[\.\)]\s*/, "").trim();
    if (!trimmed) continue;

    const lower = trimmed.toLowerCase();

    if (lower.startsWith("enter ") || lower.startsWith("type ") || lower.startsWith("fill ")) {
      const match = trimmed.match(/(?:enter|type|fill)\s+(.+?)(?:\s*[""](.+?)[""])?\s*$/i);
      if (match) {
        const target = match[1].replace(/[""]/g, "").trim();
        const value = match[2] || "";
        parsed.push({ action: "fill", target, value: value.replace(/[""]/g, "") });
      } else {
        const target = trimmed.replace(/^(enter|type|fill)\s+/i, "").trim();
        parsed.push({ action: "fill", target });
      }
    } else if (lower.startsWith("click ")) {
      const target = trimmed.replace(/^click\s+/i, "").replace(/^on\s+/i, "").trim();
      parsed.push({ action: "click", target });
    } else if (lower.startsWith("select ")) {
      const match = trimmed.match(/select\s+(.+?)(?:\s*[""](.+?)[""])?\s*$/i);
      if (match) {
        parsed.push({
          action: "select",
          target: match[1].trim(),
          value: match[2] ? match[2].replace(/[""]/g, "") : undefined,
        });
      } else {
        parsed.push({ action: "select", target: trimmed.replace(/^select\s+/i, "").trim() });
      }
    } else if (lower.startsWith("check ") || lower.startsWith("activate ")) {
      parsed.push({ action: "check", target: trimmed.replace(/^(check|activate)\s+/i, "").trim() });
    } else if (lower.startsWith("uncheck ") || lower.startsWith("deactivate ")) {
      parsed.push({ action: "uncheck", target: trimmed.replace(/^(uncheck|deactivate)\s+/i, "").trim() });
    } else if (lower.startsWith("go to ") || lower.startsWith("navigate ")) {
      parsed.push({ action: "navigate", target: trimmed.replace(/^(go to|navigate)\s+/i, "").trim() });
    } else if (lower.startsWith("validate") || lower.startsWith("verify") || lower.includes("should show") || lower.includes("should be")) {
      parsed.push({ action: "validate", target: trimmed });
    }
  }

  return parsed;
}

export function tcToPlaywrightCode(tc: TestCase, pageObjectName: string): string {
  const steps = parseSteps(tc.steps);
  const lines: string[] = [];

  lines.push(`// ${tc.id}: ${tc.scenario}`);
  lines.push(`// Precondition: ${tc.preconditions}`);
  lines.push(`await ${pageObjectName}.goto();`);
  lines.push("");

  for (const step of steps) {
    switch (step.action) {
      case "click":
        lines.push(`await ${pageObjectName}.clickElement("${sanitize(step.target)}");`);
        break;
      case "fill":
        if (step.value) {
          lines.push(`await ${pageObjectName}.fillField("${sanitize(step.target)}", "${sanitize(step.value)}");`);
        } else {
          lines.push(`// TODO: fill "${sanitize(step.target)}" with value`);
        }
        break;
      case "select":
        if (step.value) {
          lines.push(`await ${pageObjectName}.selectOption("${sanitize(step.target)}", "${sanitize(step.value)}");`);
        } else {
          lines.push(`await ${pageObjectName}.selectOption("${sanitize(step.target)}");`);
        }
        break;
      case "validate":
        const validation = step.target
          .replace(/^validate\s+/i, "")
          .replace(/^the following items are available:?\s*/i, "");
        if (validation.toLowerCase().includes("not")) {
          lines.push(`await expect(${pageObjectName}.page.getByText("${sanitize(validation)}")).not.toBeVisible();`);
        } else {
          lines.push(`await expect(${pageObjectName}.page.getByText("${sanitize(validation)}")).toBeVisible();`);
        }
        break;
      case "navigate":
        lines.push(`await ${pageObjectName}.navigateTo("${sanitize(step.target)}");`);
        break;
      case "check":
        lines.push(`await ${pageObjectName}.checkElement("${sanitize(step.target)}");`);
        break;
      case "uncheck":
        lines.push(`await ${pageObjectName}.uncheckElement("${sanitize(step.target)}");`);
        break;
    }
  }

  lines.push("");
  lines.push(`// Expected: ${tc.expected}`);
  lines.push(`await expect(${pageObjectName}.page.getByText("${sanitize(tc.expected.substring(0, 60))}")).toBeVisible();`);

  return lines.join("\n");
}

function sanitize(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}
