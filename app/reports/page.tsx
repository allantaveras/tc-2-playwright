"use client";

import React, { useEffect, useState } from "react";
import { Card, StatCard, ProgressBar, Badge, Button } from "@/components/ui";
import { ReportSummary } from "@/types";
import Link from "next/link";

export default function ReportsPage() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => {
        setSummary(data.summary || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin text-4xl mb-4">&#9696;</div>
        <p className="text-gray-500">Loading reports...</p>
      </div>
    );
  }

  if (!summary || summary.total === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reports Dashboard</h1>
        <Card>
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-lg text-gray-500 mb-2">No test results available</p>
            <p className="text-sm text-gray-400 mb-6">
              Generate and run tests to see reports here
            </p>
            <Link href="/generate">
              <Button>Go to Generate</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const filteredTests = moduleFilter === "all"
    ? summary.tests
    : summary.tests.filter(t => t.tcId.startsWith(moduleFilter));

  const modules = summary.byModule || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Test execution results and metrics
          </p>
        </div>
        <Link href="/reports">
          <Button variant="outline" size="sm">&#8635; Refresh</Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-4">
        <StatCard label="Total" value={summary.total} color="blue" />
        <StatCard label="Passed" value={summary.passed} color="green" />
        <StatCard label="Failed" value={summary.failed} color="red" />
        <StatCard label="Skipped" value={summary.skipped} color="yellow" />
        <StatCard label="Broken" value={summary.broken} color="gray" />
        <StatCard
          label="Pass Rate"
          value={`${summary.passRate}%`}
          color={summary.passRate >= 80 ? "green" : summary.passRate >= 50 ? "yellow" : "red"}
        />
      </div>

      {/* Duration */}
      <div className="text-sm text-gray-500">
        Total duration: <strong>{(summary.duration / 1000).toFixed(1)}s</strong>
      </div>

      {/* Module Breakdown */}
      {modules.length > 0 && (
        <Card title="Module Breakdown">
          <div className="space-y-3">
            {modules.map((m) => {
              const color = m.passRate >= 80 ? "green" : m.passRate >= 50 ? "yellow" : "red";
              return (
                <div key={m.module} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-28">{m.module}</span>
                  <div className="flex-1">
                    <ProgressBar value={m.passRate} color={color as any} size="sm" />
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500 w-32 justify-end">
                    <span className="text-green-600">&#10003; {m.passed}</span>
                    <span className="text-red-600">&#10007; {m.failed}</span>
                    <span>{m.skipped}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Filter */}
      <Card title="Test Case Results">
        <div className="mb-4 flex gap-2">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-48"
          >
            <option value="all">All Modules</option>
            {modules.map((m) => (
              <option key={m.module} value={m.module}>{m.module}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500 self-center">
            {filteredTests.length} tests
          </span>
        </div>

        <div className="max-h-96 overflow-y-auto border rounded-lg">
          <table className="text-sm">
            <thead>
              <tr>
                <th>TC ID</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Error</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test, i) => (
                <tr key={i}>
                  <td className="font-mono font-medium">{test.tcId}</td>
                  <td>
                    <Badge
                      variant={
                        test.status === "passed" ? "success" :
                        test.status === "failed" ? "danger" :
                        test.status === "broken" ? "warning" : "default"
                      }
                    >
                      {test.status}
                    </Badge>
                  </td>
                  <td>{(test.duration / 1000).toFixed(1)}s</td>
                  <td className="max-w-xs truncate text-gray-500">
                    {test.error || "-"}
                  </td>
                  <td>
                    <Link href={`/reports/${test.tcId}`}>
                      <span className="text-blue-600 hover:underline cursor-pointer text-xs">
                        View &#8594;
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
