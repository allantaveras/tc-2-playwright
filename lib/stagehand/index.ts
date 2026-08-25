import { ExplorationResult, SelectorMap, Credentials } from "@/types";

export interface StagehandConfig {
  env: "LOCAL" | "BROWSERBASE";
  apiKey?: string;
  projectId?: string;
  headless: boolean;
  model: string;
}

const defaultConfig: StagehandConfig = {
  env: "LOCAL",
  headless: true,
  model: "anthropic/claude-3-5-sonnet-latest",
};

let stagehandInstance: any = null;

async function getStagehand() {
  if (!stagehandInstance) {
    const { Stagehand } = await import("@browserbasehq/stagehand");
    stagehandInstance = Stagehand;
  }
  return stagehandInstance;
}

async function extractPageSelectors(
  url: string,
  credentials: { username: string; password: string } | null,
  pageDescription: string,
  tcSteps: string[]
): Promise<Record<string, string>> {
  const selectors: Record<string, string> = {};
  const StagehandClass = await getStagehand();

  const stagehand = new StagehandClass({
    ...defaultConfig,
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,
  });

  try {
    await stagehand.init();
    const { page } = stagehand;

    await page.goto(url, { waitUntil: "networkidle" });

    if (credentials) {
      await page.act({ action: `enter username ${credentials.username}` });
      await page.act({ action: `enter password ${credentials.password}` });
      await page.act({ action: "click Sign In" });
      await page.waitForTimeout(2000);
    }

    const observations = await page.observe();
    for (const obs of observations) {
      const desc = (obs.description || "").toLowerCase();
      const sel = obs.selector || "";

      if (desc.includes("username") || desc.includes("user name") || desc.includes("email")) {
        if (!selectors["usernameInput"]) selectors["usernameInput"] = sel;
      } else if (desc.includes("password") || desc.includes("pass")) {
        if (!selectors["passwordInput"]) selectors["passwordInput"] = sel;
      } else if (desc.includes("sign in") || desc.includes("login") || desc.includes("submit")) {
        if (!selectors["signInButton"]) selectors["signInButton"] = sel;
      } else if (desc.includes("search") || desc.includes("filter") || desc.includes("searchbar")) {
        const name = `searchInput_${Object.keys(selectors).filter(k => k.startsWith("searchInput")).length}`;
        if (!selectors[name]) selectors[name] = sel;
      }
    }

    await stagehand.close();
  } catch (error: any) {
    console.error(`Stagehand extraction failed for ${url}:`, error.message);
    try { await stagehand.close(); } catch {}
  }

  return selectors;
}

export async function runExploration(
  pages: { page: string; role: string }[],
  baseUrl: string,
  credentials: Credentials
): Promise<{ results: ExplorationResult[]; selectorMaps: Record<string, SelectorMap> }> {
  const results: ExplorationResult[] = [];
  const selectorMaps: Record<string, SelectorMap> = {};

  for (const { page, role } of pages) {
    const cred = credentials[role] || null;
    const url = `${baseUrl.replace(/\/$/, "")}/${page === "login" ? "" : page}`;

    try {
      const selectors = await extractPageSelectors(url, cred, page, []);
      const pageKey = `${page}_${role}`;

      selectorMaps[pageKey] = { [page]: selectors };
      results.push({
        pageName: page,
        role,
        selectors,
        status: "completed",
      });
    } catch (error: any) {
      results.push({
        pageName: page,
        role,
        selectors: {},
        status: "failed",
        error: error.message,
      });
    }
  }

  return { results, selectorMaps };
}
