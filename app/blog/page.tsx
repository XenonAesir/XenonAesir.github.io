import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";

export const metadata = { title: "博客" };

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">博客</h1>
        <p className="text-muted-foreground">共 {posts.length} 篇</p>
      </div>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">暂无文章。</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
