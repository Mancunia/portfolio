import type { BlogAsset, BlogPost } from "./types";
import { getDb } from "./db";
import { toPublicUrl, toStoredRef } from "./storage";

type DbRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date_display: string;
  read_time: string;
  tags: string[];
  assets: BlogAsset[];
  refs: unknown[];
  published: boolean;
};

function mapImageUrls(assets: BlogAsset[], fn: (url: string) => string): BlogAsset[] {
  return assets.map((a) => (a.type === "image" && a.url ? { ...a, url: fn(a.url) } : a));
}

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
    assets: mapImageUrls(r.assets ?? [], toPublicUrl),
    references: (r.refs ?? []) as BlogPost["references"],
    published: r.published,
  };
}

function assetsJson(assets: BlogAsset[]): string {
  return JSON.stringify(mapImageUrls(assets, toStoredRef));
}

export async function fetchBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  const sql = getDb();
  const rows = publishedOnly
    ? await sql`select * from blog_posts where published order by sort_order`
    : await sql`select * from blog_posts order by sort_order`;
  return (rows as DbRow[]).map(rowToPost);
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const sql = getDb();
  const rows = await sql`select * from blog_posts where slug = ${slug}`;
  return rows[0] ? rowToPost(rows[0] as DbRow) : null;
}

export async function createBlogPost(post: Omit<BlogPost, "id">): Promise<BlogPost> {
  const sql = getDb();
  const id = `bp-${Date.now()}`;
  const rows = await sql`
    insert into blog_posts
      (id, slug, title, excerpt, content, date_display, read_time, tags, assets, refs, published, sort_order)
    values (${id}, ${post.slug}, ${post.title}, ${post.excerpt}, ${post.content}, ${post.date},
      ${post.read}, ${post.tags}, ${assetsJson(post.assets)}::jsonb,
      ${JSON.stringify(post.references)}::jsonb, ${post.published}, 0)
    returning *`;
  return rowToPost(rows[0] as DbRow);
}

// Fields left undefined keep their current value.
export async function updateBlogPost(slug: string, post: Partial<BlogPost>): Promise<BlogPost> {
  const sql = getDb();
  const rows = await sql`
    update blog_posts set
      title        = coalesce(${post.title ?? null}, title),
      slug         = coalesce(${post.slug ?? null}, slug),
      excerpt      = coalesce(${post.excerpt ?? null}, excerpt),
      content      = coalesce(${post.content ?? null}, content),
      date_display = coalesce(${post.date ?? null}, date_display),
      read_time    = coalesce(${post.read ?? null}, read_time),
      tags         = coalesce(${post.tags ?? null}::text[], tags),
      assets       = coalesce(${post.assets ? assetsJson(post.assets) : null}::jsonb, assets),
      refs         = coalesce(${post.references ? JSON.stringify(post.references) : null}::jsonb, refs),
      published    = coalesce(${post.published ?? null}::boolean, published),
      updated_at   = now()
    where slug = ${slug}
    returning *`;
  if (!rows[0]) throw new Error(`Blog post not found: ${slug}`);
  return rowToPost(rows[0] as DbRow);
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const sql = getDb();
  await sql`delete from blog_posts where slug = ${slug}`;
}
