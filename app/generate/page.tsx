"use client";

import React, { useState, useCallback } from "react";
import { Card, Button, Badge, ProgressBar } from "@/components/ui";

export default function GeneratePage() {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fileCount, setFileCount] = useState(0);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);
  const [stage, setStage] = useState<"idle" | "generating" | "generated" | "running" | "done">("idle");

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setStage("generating");
    setError("");

    try {
      const res = await fetch("/api/generate", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setDownloadUrl(data.downloadUrl);
        setFileCount(data.fileCount);
        setStage("generated");
        setDone(true);
      } else {
        setError(data.error || "Generation failed");
        setStage("idle");
      }
    } catch (err: any) {
      setError(err.message || "Generation failed");
      setStage("idle");
    } finally {
      setGenerating(false);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (downloadUrl) window.location.href = downloadUrl;
  }, [downloadUrl]);

  const handleRunTests = useCallback(async () => {
    setRunning(true);
    setStage("running");

    try {
      const res = await fetch("/api/run", { method: "POST" });
      const data = await res.json();
      setRunResult(data);
      setStage("done");
    } catch (err: any) {
      setError(err.message);
      setStage("generated");
    } finally {
      setRunning(false);
    }
  }, []);

  const getStatusBadge = () => {
    if (!runResult) return null;
    const rate = runResult.passRate || 0;
    return (
      <div className={`text-center p-6 rounded-lg ${rate >= 80 ? "bg-green-50" : rate >= 50 ? "bg-yellow-50" : "bg-red-50"}`}>
        <div className={`text-4xl font-bold ${rate >= 80 ? "text-green-600" : rate >= 50 ? "text-yellow-600" : "text-red-600"}`}>
          {rate}%
        </div>
        <div className="text-sm mt-1">Pass Rate</div>
        <div className="flex gap-4 justify-center mt-3 text-sm">
          <span className="text-green-600">&#10003; {runResult.passed}</span>
          <span className="text-red-600">&#10007; {runResult.failed}</span>
          <span className="text-gray-500">&mdash; {runResult.skipped}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Generate Playwright Project</h1>
        <p className="text-gray-500 mt-1">
          Generate and download a complete Playwright test project
        </p>
      </div>

      <Card title="Generated Project">
        {stage === "idle" && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">⚙️</div>
            <p className="text-gray-500 mb-2">Ready to generate the Playwright project</p>
            <p className="text-xs text-gray-400 mb-6">
              This will create POMs, test specs, config, utils, and README
            </p>
            <Button onClick={handleGenerate} size="lg" loading={generating}>
              Generate Project
            </Button>
          </div>
        )}

        {stage === "generating" && (
          <div className="space-y-4 py-8 text-center">
            <div className="animate-spin text-4xl mb-4">&#9881;</div>
            <p className="text-gray-600">Generating project files...</p>
            <p className="text-xs text-gray-400">Creating page objects, tests, and configuration</p>
          </div>
        )}

        {done && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{fileCount}</div>
                <div className="text-xs text-green-700">Files Generated</div>
              </div>
              <div className="flex-1 bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">Playwright</div>
                <div className="text-xs text-blue-700">Test Framework</div>
              </div>
              <div className="flex-1 bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">Allure</div>
                <div className="text-xs text-purple-700">Reporting</div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={handleDownload} variant="primary">
                &#8595; Download Project (.zip)
              </Button>
              <Button onClick={handleRunTests} variant="success" loading={running}>
                &#9654; Run Tests
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </Card>

      {/* Run Results */}
      {runResult && (
        <Card title="Test Run Results">
          <div className="grid grid-cols-2 gap-6">
            {getStatusBadge()}
            <div>
              <h4 className="font-medium mb-3">Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Duration:</span><span>{(runResult.duration / 1000).toFixed(1)}s</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tests:</span><span>{runResult.total}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Passed:</span><span className="text-green-600">{runResult.passed}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Failed:</span><span className="text-red-600">{runResult.failed}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Skipped:</span><span>{runResult.skipped}</span></div>
              </div>
            </div>
          </div>

          {runResult.byModule?.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">By Module</h4>
              <div className="space-y-2">
                {runResult.byModule.map((m: any) => (
                  <div key={m.module} className="flex items-center gap-4">
                    <span className="text-sm w-24">{m.module}</span>
                    <div className="flex-1">
                      <ProgressBar value={m.passRate} color={m.passRate >= 80 ? "green" : m.passRate >= 50 ? "yellow" : "red"} size="sm" />
                    </div>
                    <span className="text-xs text-gray-500 w-20 text-right">
                      {m.passed}/{m.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => window.location.href = "/reports"}>
              View Full Reports &#8594;
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
