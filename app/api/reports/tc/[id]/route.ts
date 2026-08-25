import { NextRequest, NextResponse } from "next/server";
import { store } from "@/store";
import { getTCReport } from "@/lib/allure";
import * as path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectDir = store.getGeneratedProjectPath();
  if (!projectDir) {
    return NextResponse.json({ result: null });
  }

  const allureDir = path.join(projectDir, "allure-results");
  const result = getTCReport(allureDir, params.id);

  return NextResponse.json({ result });
}
