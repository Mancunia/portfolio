import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { fetchBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/blog-server";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const authed = await isAuthenticated();
  const post = await fetchBlogPost(slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!post.published && !authed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const post = await updateBlogPost(slug, body);
    return NextResponse.json(post);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("PUT /api/writing/[slug]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await deleteBlogPost(slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("DELETE /api/writing/[slug]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
