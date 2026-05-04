import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { fetchBlogPost } from "@/lib/blog-server";
import { PostEditor } from "@/components/PostEditor";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const authed = await isAuthenticated();
  if (!authed) redirect(`/writing`);

  const { slug } = await params;
  const post = await fetchBlogPost(slug).catch(() => null);
  if (!post) notFound();

  return <PostEditor initial={post} />;
}
