import { NextRequest, NextResponse } from "next/server";
import { store } from "@/store";
import { buildReportSummary } from "@/lib/allure";
import * as path from "path";

export async function GET() {
  const summary = store.getReportSummary();

  if (summary) {
    return NextResponse.json({ summary });
  }

  // Try to read from generated project
  const projectDir = store.getGeneratedProjectPath();
  if (projectDir) {
    const allureDir = path.join(projectDir, "allure-results");
    const reportSummary = buildReportSummary(allureDir);
    store.setReportSummary(reportSummary);
    return NextResponse.json({ summary: reportSummary });
  }

  return NextResponse.json({ summary: null });
}
