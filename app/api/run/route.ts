import { NextRequest, NextResponse } from "next/server";
import { store } from "@/store";
import { runTests, computeModuleMetrics } from "@/lib/runner";
import * as path from "path";

export async function POST() {
  const projectDir = store.getGeneratedProjectPath();
  if (!projectDir) {
    return NextResponse.json({ error: "No generated project found. Generate first." }, { status: 400 });
  }

  try {
    const summary = await runTests({
      projectDir,
      timeout: 600000,
    });

    summary.byModule = computeModuleMetrics(summary.tests);
    store.setReportSummary(summary);

    return NextResponse.json(summary);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
