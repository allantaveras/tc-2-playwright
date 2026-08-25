import { TestCase, Credentials, SelectorMap, MODULE_NAMES } from "@/types";
import { getModulePrefix, getModuleName, groupTCsByModule } from "@/lib/tc-parser";

import { getBasePageTemplate } from "./templates/pom-templates";
import { getLoginPageTemplate } from "./templates/pom-templates";
import { getHomePageTemplate } from "./templates/pom-templates";
import { getClientsPageTemplate } from "./templates/pom-templates";
import { getTeamsPageTemplate } from "./templates/pom-templates";
import { getRosterPageTemplate } from "./templates/pom-templates";

import { getLoginTestsTemplate } from "./templates/test-templates";
import { getHomeTestsTemplate } from "./templates/test-templates";
import { getTimesheetsTestsTemplate } from "./templates/test-templates";
import { getEvaluationsTestsTemplate } from "./templates/test-templates";
import { getGenericTestsTemplate } from "./templates/test-templates";

import {
  getPlaywrightConfigTemplate,
  getPackageJsonTemplate,
  getEnvTemplate,
  getAuthSetupTemplate,
  getLoginUtilTemplate,
  getConfigUtilTemplate,
  getAuthHelperTemplate,
  getTsconfigTemplate,
  getReadmeTemplate,
} from "./templates/config-template";

export interface GeneratedFile {
  path: string;
  content: string;
}

export function generateProject(
  tcs: TestCase[],
  credentials: Credentials,
  targetUrl: string,
  selectorMaps?: Record<string, SelectorMap>
): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const groups = groupTCsByModule(tcs);

  // Root config files
  files.push({ path: "playwright.config.ts", content: getPlaywrightConfigTemplate() });
  files.push({ path: "package.json", content: getPackageJsonTemplate() });
  files.push({ path: ".env", content: getEnvTemplate() });
  files.push({ path: ".env.example", content: getEnvTemplate() });
  files.push({ path: "tsconfig.json", content: getTsconfigTemplate() });
  files.push({ path: "README.md", content: getReadmeTemplate(targetUrl) });

  // Utils
  files.push({ path: "utils/config.ts", content: getConfigUtilTemplate() });
  files.push({ path: "utils/Login.ts", content: getLoginUtilTemplate() });
  files.push({ path: "utils/authHelper.ts", content: getAuthHelperTemplate() });

  // Auth setup
  files.push({ path: "tests/auth.setup.ts", content: getAuthSetupTemplate() });

  // Page Objects
  files.push({ path: "pages/BasePage.ts", content: getBasePageTemplate() });
  files.push({ path: "pages/LoginPage.ts", content: getLoginPageTemplate() });
  files.push({ path: "pages/HomePage.ts", content: getHomePageTemplate() });
  files.push({ path: "pages/ClientsPage.ts", content: getClientsPageTemplate() });
  files.push({ path: "pages/TeamsPage.ts", content: getTeamsPageTemplate() });
  files.push({ path: "pages/RosterPage.ts", content: getRosterPageTemplate() });

  // Generate POM for each module that has TCs
  for (const [moduleName, moduleTCs] of Object.entries(groups)) {
    const prefix = getModulePrefix(moduleTCs[0].id);
    const pomName = `${moduleName.replace(/[^a-zA-Z]/g, "")}Page`;
    const pomPath = `pages/${pomName}.ts`;

    if (!files.find(f => f.path === pomPath)) {
      const pomContent = generatePOM(prefix, moduleName);
      files.push({ path: pomPath, content: pomContent });
    }

    // Generate test spec
    const testPath = `tests/${moduleName.toLowerCase().replace(/[^a-z]/g, "-")}.spec.ts`;
    const testContent = generateTestSpec(moduleName, moduleTCs);
    files.push({ path: testPath, content: testContent });
  }

  // Ensure specific test files exist
  const testFiles: Record<string, string> = {
    "tests/login.spec.ts": getLoginTestsTemplate(),
    "tests/home.spec.ts": getHomeTestsTemplate(),
    "tests/timesheets.spec.ts": getTimesheetsTestsTemplate(),
    "tests/evaluations.spec.ts": getEvaluationsTestsTemplate(),
  };

  for (const [path, content] of Object.entries(testFiles)) {
    if (!files.find(f => f.path === path)) {
      files.push({ path, content });
    }
  }

  // Create auth directory placeholder
  files.push({
    path: "playwright/.auth/.gitkeep",
    content: "",
  });

  return files;
}

function generatePOM(prefix: string, moduleName: string): string {
  const className = `${moduleName.replace(/[^a-zA-Z]/g, "")}Page`;
  return `import { BasePage } from './BasePage';

export class ${className} extends BasePage {
  async navigate() {
    await this.goto();
  }

  async waitForLoad() {
    await this.waitForTimeout(1000);
  }
}
`;
}

function generateTestSpec(moduleName: string, tcs: TestCase[]): string {
  if (tcs.length === 0) {
    return `import { test } from '@playwright/test';

test.describe('${moduleName} Module', () => {
  // No test cases available for this module
});
`;
  }

  const loginTcs = tcs.filter(t => t.id.startsWith("L"));
  const homeTcs = tcs.filter(t => t.id.startsWith("H"));

  if (loginTcs.length > 0) return getLoginTestsTemplate();
  if (homeTcs.length > 0) return getHomeTestsTemplate();

  return getGenericTestsTemplate(moduleName, tcs);
}
