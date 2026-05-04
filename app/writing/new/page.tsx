import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { PostEditor } from "@/components/PostEditor";

export default async function NewPostPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/writing");
  return <PostEditor />;
}
