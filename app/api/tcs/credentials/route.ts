import { NextRequest, NextResponse } from "next/server";
import { parseCredentials } from "@/lib/credentials";
import { store } from "@/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credentials: jsonString } = body;

    if (!jsonString) {
      return NextResponse.json({ errors: ["No credentials JSON provided"] }, { status: 400 });
    }

    const { creds, errors } = parseCredentials(jsonString);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    store.setCredentials(creds);
    return NextResponse.json({ success: true, roles: Object.keys(creds) });
  } catch (err: any) {
    return NextResponse.json({ errors: [err.message] }, { status: 500 });
  }
}
