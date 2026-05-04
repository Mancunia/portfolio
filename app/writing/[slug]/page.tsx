import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBlogPost } from "@/lib/blog-server";
import { PostReader } from "@/components/PostReader";
import { markdownToHtml } from "@/lib/markdown";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Readonly<Props>): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug).catch(() => null);
  if (!post?.published) return {};

  const description = post.excerpt || `${post.read} read · ${post.date}`;
  const ogImage = post.assets.find((a) => a.type === "image")?.url;

  return {
    title: `${post.title} — Emmanuel Osei Mensah`,
    description,
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.date,
      authors: ["Emmanuel Osei Mensah"],
      tags: post.tags,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: post.title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function PostPage({ params }: Readonly<Props>) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug).catch(() => null);

  if (!post?.published) notFound();

  const renderedContent = markdownToHtml(post.content);

  return <PostReader post={{ ...post, content: renderedContent }} />;
}
