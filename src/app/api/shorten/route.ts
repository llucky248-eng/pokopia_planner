import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ errormessage: "Missing url parameter." }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`,
      { headers: { "User-Agent": "pokopia-planner/1.0" } }
    );
    const data = await res.json() as { shorturl?: string; errormessage?: string };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ errormessage: "Could not reach is.gd." }, { status: 502 });
  }
}
