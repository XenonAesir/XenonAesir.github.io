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
          <time
            dateTime={post.date}
            className="text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase"
          >
            {post.date}
          </time>
        </CardHeader>
      </Card>
    </Link>
  );
}
