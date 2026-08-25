"use client";

import React, { useEffect, useState } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { TestCase, MODULE_NAMES } from "@/types";
import { getModuleName } from "@/lib/tc-parser";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TestCaseDetailPage() {
  const params = useParams();
  const tcId = params.id as string;

  const [tc, setTc] = useState<TestCase | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/tcs/${tcId}`).then(r => r.json()).catch(() => ({})),
      fetch(`/api/reports/tc/${tcId}`).then(r => r.json()).catch(() => ({})),
    ]).then(([tcData, reportData]) => {
      if (tcData.tc) setTc(tcData.tc);
      if (reportData.result) setTestResult(reportData.result);
    }).finally(() => setLoading(false));
  }, [tcId]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin text-4xl mb-4">&#9696;</div>
        <p className="text-gray-500">Loading test case details...</p>
      </div>
    );
  }

  if (!tc) {
    return (
      <div className="space-y-6">
        <Link href="/reports" className="text-blue-600 hover:underline text-sm">&#8592; Back to Reports</Link>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Test case {tcId} not found</p>
          </div>
        </Card>
      </div>
    );
  }

  const status = testResult?.status || "unknown";
  const statusVariant = status === "passed" ? "success" : status === "failed" ? "danger" : status === "broken" ? "warning" : "default";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/reports" className="text-blue-600 hover:underline text-sm">&#8592; Back</Link>
        <h1 className="text-2xl font-bold">{tc.id}</h1>
        <Badge variant={statusVariant as any}>{status}</Badge>
      </div>

      {/* Metadata */}
      <Card title="Test Case Info">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">ID:</span>
            <span className="ml-2 font-mono">{tc.id}</span>
          </div>
          <div>
            <span className="text-gray-500">Module:</span>
            <span className="ml-2">{getModuleName(tc.id)}</span>
          </div>
          <div>
            <span className="text-gray-500">Scenario:</span>
            <span className="ml-2">{tc.scenario}</span>
          </div>
          <div>
            <span className="text-gray-500">Test Case:</span>
            <span className="ml-2">{tc.test_case}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Sheet:</span>
            <span className="ml-2">{tc.sheet || "N/A"}</span>
          </div>
        </div>
      </Card>

      {/* Preconditions */}
      <Card title="Preconditions">
        <pre className="text-sm whitespace-pre-wrap font-sans bg-gray-50 p-4 rounded-lg">
          {tc.preconditions || "None"}
        </pre>
      </Card>

      {/* Steps */}
      <Card title="Steps">
        <div className="space-y-2">
          {tc.steps.split("\n").filter(l => l.trim()).map((step, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="text-gray-400 font-mono w-6 shrink-0">{i + 1}.</span>
              <span>{step.replace(/^\d+[\.\)]\s*/, "").trim()}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Expected */}
      <Card title="Expected Result">
        <p className="text-sm">{tc.expected}</p>
      </Card>

      {/* Test Result */}
      {testResult && (
        <Card title="Actual Result">
          <div className="space-y-3 text-sm">
            <div className="flex gap-4">
              <span className="text-gray-500">Status:</span>
              <Badge variant={statusVariant as any}>{testResult.status}</Badge>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-500">Duration:</span>
              <span>{(testResult.duration / 1000).toFixed(1)}s</span>
            </div>
            {testResult.error && (
              <div>
                <span className="text-gray-500">Error:</span>
                <pre className="mt-1 p-3 bg-red-50 rounded-lg text-red-700 text-xs whitespace-pre-wrap">
                  {testResult.error}
                </pre>
              </div>
            )}
            {testResult.screenshot && (
              <div>
                <span className="text-gray-500">Screenshot:</span>
                <img src={testResult.screenshot} alt="Test screenshot" className="mt-2 border rounded-lg max-w-full" />
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
