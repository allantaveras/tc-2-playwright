"use client";

import React, { useState, useCallback } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { useRouter } from "next/navigation";
import { TestCase, MODULE_NAMES } from "@/types";
import { getModuleName } from "@/lib/tc-parser";

export default function UploadPage() {
  const router = useRouter();
  const [tcs, setTcs] = useState<TestCase[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [targetUrl, setTargetUrl] = useState("https://www.saucedemo.com/");
  const [credentialsJson, setCredentialsJson] = useState("");
  const [credsErrors, setCredsErrors] = useState<string[]>([]);
  const [step, setStep] = useState<"upload" | "review" | "done">("upload");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrors([]);

    try {
      const text = await file.text();
      const res = await fetch("/api/tcs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tcs: text, targetUrl }),
      });

      const data = await res.json();
      if (data.errors?.length > 0) {
        setErrors(data.errors);
      } else {
        setTcs(data.tcs || []);
        setStep("review");
      }
    } catch (err: any) {
      setErrors([err.message || "Failed to upload file"]);
    } finally {
      setLoading(false);
    }
  }, [targetUrl]);

  const handleCredentialsUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await fetch("/api/tcs/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentials: text }),
      });

      const data = await res.json();
      if (data.errors?.length > 0) {
        setCredsErrors(data.errors);
      } else {
        setCredentialsJson(text);
        setCredsErrors([]);
      }
    } catch (err: any) {
      setCredsErrors([err.message]);
    }
  }, []);

  const handleProceed = () => {
    router.push("/explore");
  };

  const handleSaveUrl = async () => {
    await fetch("/api/tcs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUrl }),
    });
  };

  const moduleGroups = tcs.reduce((acc: Record<string, TestCase[]>, tc) => {
    const module = getModuleName(tc.id);
    if (!acc[module]) acc[module] = [];
    acc[module].push(tc);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Upload Test Cases</h1>
        <p className="text-gray-500 mt-1">
          Upload your TC JSON file and credentials to get started
        </p>
      </div>

      {/* Step 1: Upload */}
      <Card title="1. Upload Test Case JSON">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              id="tc-file"
            />
            <label htmlFor="tc-file" className="cursor-pointer">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-gray-600 mb-1">
                {loading ? "Uploading..." : "Click to upload TC JSON file"}
              </p>
              <p className="text-xs text-gray-400">
                Supports the format from all_test_cases_extracted.json
              </p>
            </label>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-medium text-red-800 mb-2">Validation Errors:</p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Target URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                onBlur={handleSaveUrl}
                className="flex-1"
                placeholder="https://www.saucedemo.com/"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Step 2: Credentials */}
      <Card title="2. Upload Credentials (Optional)">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".json"
              onChange={handleCredentialsUpload}
              className="hidden"
              id="creds-file"
            />
            <label htmlFor="creds-file" className="cursor-pointer">
              <div className="text-3xl mb-2">🔑</div>
              <p className="text-sm text-gray-600">Upload credentials JSON</p>
              <p className="text-xs text-gray-400 mt-1">
                Format: {`{ "admin": { "username": "...", "password": "..." } }`}
              </p>
            </label>
          </div>

          {credsErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              {credsErrors.map((err, i) => (
                <p key={i} className="text-sm text-red-700">{err}</p>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Step 3: Review */}
      {step === "review" && tcs.length > 0 && (
        <Card title={`3. Review Test Cases (${tcs.length} total)`}>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(moduleGroups).map(([module, cases]) => (
                <div key={module} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold">{cases.length}</div>
                  <div className="text-xs text-gray-500">{module}</div>
                </div>
              ))}
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-lg">
              <table className="text-xs">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Scenario</th>
                    <th>Type</th>
                    <th>Module</th>
                    <th>Sheet</th>
                  </tr>
                </thead>
                <tbody>
                  {tcs.map((tc) => (
                    <tr key={tc.id}>
                      <td className="font-mono font-medium">{tc.id}</td>
                      <td>{tc.scenario}</td>
                      <td>{tc.test_case}</td>
                      <td><Badge>{getModuleName(tc.id)}</Badge></td>
                      <td>{tc.sheet || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setStep("upload")}>
                Back
              </Button>
              <Button onClick={handleProceed}>
                Proceed to Explore &#8594;
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
