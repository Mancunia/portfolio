import { fetchBlogPosts } from "@/lib/blog-server";
import { WritingList } from "@/components/WritingList";
import type { BlogPost } from "@/lib/types";

export const revalidate = 60;

export default async function WritingPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await fetchBlogPosts(true);
  } catch {
    posts = [];
  }
  return <WritingList posts={posts} />;
}
