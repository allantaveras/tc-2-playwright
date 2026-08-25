import { NextRequest, NextResponse } from "next/server";
import { store } from "@/store";
import { generateProject, GeneratedFile } from "@/lib/generator";
import { bundleProject } from "@/lib/generator/project-bundler";
import * as path from "path";
import * as fs from "fs";

export async function GET() {
  const projectPath = store.getGeneratedProjectPath();
  return NextResponse.json({ projectPath });
}

export async function POST() {
  const tcs = store.getTCs();
  if (tcs.length === 0) {
    return NextResponse.json({ error: "No test cases loaded" }, { status: 400 });
  }

  const credentials = store.getCredentials();
  const targetUrl = store.getTargetUrl();
  const selectorMaps = store.getSelectorMaps();

  try {
    const files: GeneratedFile[] = generateProject(tcs, credentials, targetUrl, selectorMaps);

    const outputDir = path.join(process.cwd(), "generated-projects");
    const projectDir = await bundleProject(files, outputDir, "ntsuite-tests");

    // Create zip
    const archiver = require("archiver");
    const zipPath = path.join(outputDir, "ntsuite-tests.zip");
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    await new Promise<void>((resolve, reject) => {
      output.on("close", () => resolve());
      archive.on("error", (err: any) => reject(err));
      archive.pipe(output);
      archive.directory(projectDir, "ntsuite-tests");
      archive.finalize();
    });

    store.setGeneratedProjectPath(projectDir);

    return NextResponse.json({
      success: true,
      fileCount: files.length,
      downloadUrl: "/api/download",
      projectPath: projectDir,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
