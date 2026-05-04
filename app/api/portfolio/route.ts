import { NextResponse } from "next/server";
import { fetchPortfolioData, savePortfolioData } from "@/lib/supabase-server";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const data = await fetchPortfolioData();
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/portfolio error:", err);
    return NextResponse.json({ error: "Failed to load portfolio" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    await savePortfolioData(data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PUT /api/portfolio error:", err);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
