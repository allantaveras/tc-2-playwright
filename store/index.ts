import { TestCase, Credentials, SelectorMap, ExplorationResult, GenerationOptions, ReportSummary } from "@/types";

class Store {
  private tcs: TestCase[] = [];
  private credentials: Credentials = {};
  private targetUrl: string = process.env.NEXT_PUBLIC_DEFAULT_URL || "http://qa.evosphere.nt.core/";
  private selectorMaps: Record<string, SelectorMap> = {};
  private explorationResults: ExplorationResult[] = [];
  private generationOptions: GenerationOptions = {
    targetUrl: this.targetUrl,
    includePOMs: true,
    includeAllure: true,
    includeStagehand: false,
  };
  private generatedProjectPath: string = "";
  private reportSummary: ReportSummary | null = null;
  private currentRunId: string = "";

  setTCs(tcs: TestCase[]) { this.tcs = tcs; }
  getTCs() { return this.tcs; }
  getTCById(id: string) { return this.tcs.find(tc => tc.id === id); }

  setCredentials(creds: Credentials) { this.credentials = creds; }
  getCredentials() { return this.credentials; }

  setTargetUrl(url: string) { this.targetUrl = url; }
  getTargetUrl() { return this.targetUrl; }

  setSelectorMaps(maps: Record<string, SelectorMap>) { this.selectorMaps = maps; }
  getSelectorMaps() { return this.selectorMaps; }

  setExplorationResults(results: ExplorationResult[]) { this.explorationResults = results; }
  getExplorationResults() { return this.explorationResults; }

  setGenerationOptions(opts: Partial<GenerationOptions>) {
    this.generationOptions = { ...this.generationOptions, ...opts };
  }
  getGenerationOptions() { return this.generationOptions; }

  setGeneratedProjectPath(path: string) { this.generatedProjectPath = path; }
  getGeneratedProjectPath() { return this.generatedProjectPath; }

  setReportSummary(summary: ReportSummary) { this.reportSummary = summary; }
  getReportSummary() { return this.reportSummary; }

  setCurrentRunId(id: string) { this.currentRunId = id; }
  getCurrentRunId() { return this.currentRunId; }

  clear() {
    this.tcs = [];
    this.credentials = {};
    this.selectorMaps = {};
    this.explorationResults = [];
    this.generatedProjectPath = "";
    this.reportSummary = null;
  }
}

export const store = new Store();
