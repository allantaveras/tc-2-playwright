import { NextRequest, NextResponse } from "next/server";
import { store } from "@/store";
import { extractUniquePages } from "@/lib/tc-parser";
import { runExploration } from "@/lib/stagehand";

export async function GET() {
  const results = store.getExplorationResults();
  const selectorMaps = store.getSelectorMaps();
  return NextResponse.json({ results, selectorMaps });
}

export async function POST() {
  const tcs = store.getTCs();
  if (tcs.length === 0) {
    return NextResponse.json({ error: "No test cases loaded" }, { status: 400 });
  }

  const credentials = store.getCredentials();
  const targetUrl = store.getTargetUrl();

  const pages = extractUniquePages(tcs);

  try {
    const { results, selectorMaps } = await runExploration(pages, targetUrl, credentials);
    store.setExplorationResults(results);
    store.setSelectorMaps(selectorMaps);

    return NextResponse.json({
      success: true,
      total: results.length,
      results: results.map((r) => ({
        pageName: r.pageName,
        role: r.role,
        selectorCount: Object.keys(r.selectors).length,
        status: r.status,
      })),
      selectorMaps,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
