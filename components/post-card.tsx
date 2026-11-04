import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PostMeta } from "@/lib/posts";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card className="glass-panel glass-card rounded-2xl">
        <CardHeader>
          <CardTitle className="font-heading text-xl font-normal tracking-wide">{post.title}</CardTitle>
          <CardDescription className="font-light">{post.summary}</CardDescription>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase">
            <time dateTime={post.date}>{post.date}</time>
            <span aria-hidden>·</span>
            <span>{post.minutes} 分钟</span>
            {post.draft && <span className="text-primary">草稿</span>}
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border px-2 py-0.5 tracking-[0.1em]">
                {tag}
              </span>
            ))}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
