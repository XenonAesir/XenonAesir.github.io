import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";

export const metadata = { title: "博客" };

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-6 pt-10 pb-20">
      <div className="space-y-3">
        <h1 className="font-heading text-3xl font-light tracking-wide">博客</h1>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
          共 {posts.length} 篇
        </p>
        <div className="hairline" />
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
