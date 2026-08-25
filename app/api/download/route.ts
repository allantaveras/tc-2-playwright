import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import * as fs from "fs";

export async function GET() {
  const zipPath = path.join(process.cwd(), "generated-projects", "ntsuite-tests.zip");

  if (!fs.existsSync(zipPath)) {
    return NextResponse.json({ error: "No generated project found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(zipPath);
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="ntsuite-tests.zip"',
      "Content-Length": fileBuffer.length.toString(),
    },
  });
}
