import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { fetchBlogPosts, createBlogPost } from "@/lib/blog-server";

export async function GET() {
  const authed = await isAuthenticated();
  try {
    const posts = await fetchBlogPosts(!authed);
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const post = await createBlogPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("POST /api/writing:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
