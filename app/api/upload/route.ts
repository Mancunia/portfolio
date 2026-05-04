import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAuthenticated } from "@/lib/auth";

const BUCKET = "assets";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key);
}

export async function POST(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const kind = form.get("kind");
  const path = kind === "blog" ? `blog/${Date.now()}.${ext}` : `portrait.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const db = getServiceClient();
  const { error } = await db.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) {
    console.error("Storage upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = db.storage.from(BUCKET).getPublicUrl(path);
  // Bust cache so the browser fetches the new image
  const url = `${data.publicUrl}?t=${Date.now()}`;
  return NextResponse.json({ url });
}
