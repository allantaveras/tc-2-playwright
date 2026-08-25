"use client";

import React, { useEffect, useState } from "react";
import { Card, StatCard, ProgressBar } from "@/components/ui";
import { ReportSummary } from "@/types";
import Link from "next/link";

export default function DashboardPage() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [tcCount, setTcCount] = useState(0);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => {
        if (data.summary) setSummary(data.summary);
      })
      .catch(() => {});

    fetch("/api/tcs")
      .then((r) => r.json())
      .then((data) => {
        if (data.total) setTcCount(data.total);
      })
      .catch(() => {});
  }, []);

  const modules = summary?.byModule || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            TC-to-Playwright converts manual test cases into automated Playwright tests
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/upload">
            <button className="btn-primary">Upload Test Cases</button>
          </Link>
          <Link href="/generate">
            <button className="btn-outline">Generate Project</button>
          </Link>
        </div>
      </div>

      {/* Quick Start */}
      <Card title="Quick Start Guide">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <div className="text-2xl mb-2">📤</div>
            <h3 className="font-medium text-sm">1. Upload</h3>
            <p className="text-xs text-gray-500 mt-1">Upload TC JSON + credentials</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-medium text-sm">2. Explore</h3>
            <p className="text-xs text-gray-500 mt-1">Stagehand extracts selectors</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-medium text-sm">3. Generate</h3>
            <p className="text-xs text-gray-500 mt-1">POM + tests + config</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg text-center">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-medium text-sm">4. Run & Report</h3>
            <p className="text-xs text-gray-500 mt-1">Execute & view Allure dashboard</p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      {summary && (
        <div className="grid grid-cols-5 gap-4">
          <StatCard label="Total Test Cases" value={summary.total} color="blue" />
          <StatCard label="Passed" value={summary.passed} color="green" />
          <StatCard label="Failed" value={summary.failed} color="red" />
          <StatCard label="Skipped" value={summary.skipped} color="yellow" />
          <StatCard label="Pass Rate" value={`${summary.passRate}%`} color={summary.passRate >= 80 ? "green" : summary.passRate >= 50 ? "yellow" : "red"} />
        </div>
      )}

      {!summary && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total TCs Loaded" value={tcCount} color="blue" />
          <StatCard label="Tests Run" value="0" color="gray" />
        </div>
      )}

      {/* Module Breakdown */}
      {modules.length > 0 && (
        <Card title="Module Breakdown">
          <table>
            <thead>
              <tr>
                <th>Module</th>
                <th>Total</th>
                <th>Passed</th>
                <th>Failed</th>
                <th>Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.module}>
                  <td className="font-medium">{m.module}</td>
                  <td>{m.total}</td>
                  <td className="text-green-600">{m.passed}</td>
                  <td className="text-red-600">{m.failed}</td>
                  <td className="w-48">
                    <ProgressBar
                      value={m.passRate}
                      color={m.passRate >= 80 ? "green" : m.passRate >= 50 ? "yellow" : "red"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Recent Activity */}
      {tcCount === 0 && !summary && (
        <Card title="Load Test Cases to Begin">
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-lg mb-2">No test cases loaded yet</p>
            <p className="text-sm mb-6">
              Upload your test case JSON file to get started
            </p>
            <Link href="/upload">
              <button className="btn-primary">Upload Test Cases</button>
            </Link>
          </div>
        </Card>
      )}
      {(tcCount > 0 || summary) && (
        <Card title="Recent Activity">
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-sm font-medium">Test cases loaded successfully from JSON.</p>
              <span className="text-xs text-gray-400 ml-auto">Just now</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <p className="text-sm font-medium">Stagehand exploration completed.</p>
              <span className="text-xs text-gray-400 ml-auto">1 min ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <p className="text-sm font-medium">Playwright project generated.</p>
              <span className="text-xs text-gray-400 ml-auto">2 mins ago</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
