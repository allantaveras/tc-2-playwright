import { GeneratedFile } from "./index";
import * as fs from "fs";
import * as path from "path";

export async function bundleProject(
  files: GeneratedFile[],
  outputDir: string,
  projectName: string = "ntsuite-tests"
): Promise<string> {
  const projectDir = path.join(outputDir, projectName);

  if (fs.existsSync(projectDir)) {
    fs.rmSync(projectDir, { recursive: true });
  }

  for (const file of files) {
    const fullPath = path.join(projectDir, file.path);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, file.content, "utf-8");
  }

  return projectDir;
}

export async function createZip(
  sourceDir: string,
  outputPath: string
): Promise<string> {
  const archiver = require("archiver");
  const output = fs.createWriteStream(outputPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on("close", () => resolve(outputPath));
    archive.on("error", (err: any) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}
