// src/app/api/generate/mode-a/route.ts
import { NextResponse } from "next/server";
import { generateContent } from "../../../../lib/contentGenerator";

export async function POST(request) {
  const body = await request.json();
  const { input } = body;
  const result = generateContent(input, "A");
  return NextResponse.json({ result });
}
