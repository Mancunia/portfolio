import { createClient } from "@supabase/supabase-js";
import type { BlogPost } from "./types";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars are not set");
  return createClient(url, key);
}

type DbRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date_display: string;
  read_time: string;
  tags: string[];
  assets: unknown[];
  refs: unknown[];
  published: boolean;
};

function rowToPost(r: DbRow): BlogPost {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    date: r.date_display,
    read: r.read_time,
    tags: r.tags ?? [],
    assets: (r.assets ?? []) as BlogPost["assets"],
    references: (r.refs ?? []) as BlogPost["references"],
    published: r.published,
  };
}

export async function fetchBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  const db = getServiceClient();
  let q = db.from("blog_posts").select("*").order("sort_order");
  if (publishedOnly) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return ((data ?? []) as DbRow[]).map(rowToPost);
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return rowToPost(data as DbRow);
}

export async function createBlogPost(post: Omit<BlogPost, "id">): Promise<BlogPost> {
  const db = getServiceClient();
  const id = `bp-${Date.now()}`;
  const { data, error } = await db
    .from("blog_posts")
    .insert({
      id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date_display: post.date,
      read_time: post.read,
      tags: post.tags,
      assets: post.assets,
      refs: post.references,
      published: post.published,
      sort_order: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToPost(data as DbRow);
}

export async function updateBlogPost(slug: string, post: Partial<BlogPost>): Promise<BlogPost> {
  const db = getServiceClient();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (post.title !== undefined) patch.title = post.title;
  if (post.slug !== undefined) patch.slug = post.slug;
  if (post.excerpt !== undefined) patch.excerpt = post.excerpt;
  if (post.content !== undefined) patch.content = post.content;
  if (post.date !== undefined) patch.date_display = post.date;
  if (post.read !== undefined) patch.read_time = post.read;
  if (post.tags !== undefined) patch.tags = post.tags;
  if (post.assets !== undefined) patch.assets = post.assets;
  if (post.references !== undefined) patch.refs = post.references;
  if (post.published !== undefined) patch.published = post.published;

  const { data, error } = await db
    .from("blog_posts")
    .update(patch)
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw error;
  return rowToPost(data as DbRow);
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const db = getServiceClient();
  const { error } = await db.from("blog_posts").delete().eq("slug", slug);
  if (error) throw error;
}
