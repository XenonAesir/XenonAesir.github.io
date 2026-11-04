import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PostMeta } from "@/lib/posts";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card className="transition-colors hover:bg-muted/60">
        <CardHeader>
          <CardTitle className="text-base">{post.title}</CardTitle>
          <CardDescription>{post.summary}</CardDescription>
          <time dateTime={post.date} className="text-xs text-muted-foreground">
            {post.date}
          </time>
        </CardHeader>
      </Card>
    </Link>
  );
}
