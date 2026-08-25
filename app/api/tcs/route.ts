import { NextRequest, NextResponse } from "next/server";
import { parseTCs } from "@/lib/tc-parser";
import { parseCredentials } from "@/lib/credentials";
import { store } from "@/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tcs: jsonString, targetUrl } = body;

    if (!jsonString) {
      return NextResponse.json({ errors: ["No JSON content provided"] }, { status: 400 });
    }

    const { tcs, errors } = parseTCs(jsonString);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    store.setTCs(tcs);
    if (targetUrl) store.setTargetUrl(targetUrl);

    return NextResponse.json({
      success: true,
      total: tcs.length,
      tcs: tcs.map(({ id, scenario, test_case }) => ({ id, scenario, test_case })),
    });
  } catch (err: any) {
    return NextResponse.json({ errors: [err.message] }, { status: 500 });
  }
}

export async function GET() {
  const tcs = store.getTCs();
  return NextResponse.json({ total: tcs.length, tcs });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.targetUrl) store.setTargetUrl(body.targetUrl);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
