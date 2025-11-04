// src/app/api/pexels/search/route.ts
import { NextResponse } from "next/server";
import { searchPhotos } from "../../../lib/pexels";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "demo";
  const images = await searchPhotos(query);
  return NextResponse.json({ images });
}
