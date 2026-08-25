"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Badge, ProgressBar } from "@/components/ui";
import { useRouter } from "next/navigation";
import { ExplorationResult, SelectorMap } from "@/types";

export default function ExplorePage() {
  const router = useRouter();
  const [results, setResults] = useState<ExplorationResult[]>([]);
  const [selectorMaps, setSelectorMaps] = useState<Record<string, SelectorMap>>({});
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");

  useEffect(() => {
    fetch("/api/explore", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setResults(data.results);
          setSelectorMaps(data.selectorMaps || {});
          setTotalPages(data.results.length);
          setProgress(100);
          setStatus("done");
        }
      })
      .catch(() => {});
  }, []);

  const startExploration = useCallback(async () => {
    setRunning(true);
    setStatus("running");
    setProgress(0);

    try {
      const res = await fetch("/api/explore", { method: "POST" });
      const data = await res.json();

      if (data.results) {
        setResults(data.results);
        setSelectorMaps(data.selectorMaps || {});
        setTotalPages(data.results.length);
        setProgress(100);
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setRunning(false);
    }
  }, []);

  const completedCount = results.filter((r) => r.status === "completed").length;
  const failedCount = results.filter((r) => r.status === "failed").length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stagehand Exploration</h1>
          <p className="text-gray-500 mt-1">
            Stagehand explores each page and extracts element selectors
          </p>
        </div>
        <div className="flex gap-3">
          {status === "done" && (
            <Button onClick={() => router.push("/generate")}>
              Proceed to Generate &#8594;
            </Button>
          )}
        </div>
      </div>

      <Card title="Exploration Status">
        {status === "idle" && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 mb-6">
              Start Stagehand exploration to discover page selectors
            </p>
            <Button onClick={startExploration} size="lg">
              Start Exploration
            </Button>
          </div>
        )}

        {status === "running" && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Exploring pages...</span>
              <span className="text-sm text-gray-500">
                {completedCount + failedCount} / {totalPages || "?"}
              </span>
            </div>
            <ProgressBar value={progress} color="blue" />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="animate-spin">&#9696;</span>
              Stagehand is browsing and extracting selectors...
            </div>
          </div>
        )}

        {status === "done" && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="px-4 py-3 bg-green-50 rounded-lg flex-1 text-center">
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-xs text-green-700">Pages Completed</div>
              </div>
              <div className="px-4 py-3 bg-red-50 rounded-lg flex-1 text-center">
                <div className="text-2xl font-bold text-red-600">{failedCount}</div>
                <div className="text-xs text-red-700">Pages Failed</div>
              </div>
              <div className="px-4 py-3 bg-blue-50 rounded-lg flex-1 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {results.reduce((sum, r) => sum + Object.keys(r.selectors).length, 0)}
                </div>
                <div className="text-xs text-blue-700">Selectors Found</div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto border rounded-lg">
              <table className="text-sm">
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Role</th>
                    <th>Selectors</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      <td className="font-medium">{r.pageName}</td>
                      <td><Badge>{r.role}</Badge></td>
                      <td>{Object.keys(r.selectors).length}</td>
                      <td>
                        <Badge variant={r.status === "completed" ? "success" : "danger"}>
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Exploration failed or no TCs loaded</p>
            <Button variant="outline" onClick={() => router.push("/upload")}>
              Upload Test Cases First
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
