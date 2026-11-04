import { BlogBrowser } from "@/components/blog-browser";
import { getAllPosts } from "@/lib/posts";

export const metadata = { title: "博客" };

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-10 pb-20">
      <BlogBrowser posts={getAllPosts()} />
    </div>
  );
}
