import { NextRequest, NextResponse } from "next/server";
import { store } from "@/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tc = store.getTCById(params.id);
  if (!tc) {
    return NextResponse.json({ error: "Test case not found" }, { status: 404 });
  }
  return NextResponse.json({ tc });
}
