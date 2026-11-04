import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { CodePre } from "@/components/code-pre";
import { ReadingProgress } from "@/components/reading-progress";
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { newer, older } = getAdjacentPosts(slug);

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto w-full max-w-3xl px-6 pt-10 pb-20">
        <header className="mb-10 space-y-4">
          <h1 className="font-heading text-3xl font-light tracking-wide sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
            <time dateTime={post.date}>{post.date}</time>
            <span aria-hidden>·</span>
            <span>{post.minutes} 分钟</span>
            {post.tags.map((tag) => (
              <span key={tag} className="border border-border px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
          <div className="hairline" />
        </header>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <MDXRemote
            source={post.content}
            components={{ pre: CodePre }}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [
                  rehypeKatex,
                  [
                    rehypePrettyCode,
                    {
                      theme: { light: "github-light", dark: "github-dark" },
                      keepBackground: false,
                    },
                  ],
                ],
              },
            }}
          />
        </div>

        {(newer || older) && (
          <nav className="mt-16 grid gap-6 border-t border-border/60 pt-6 text-sm sm:grid-cols-2">
            {newer ? (
              <Link href={`/blog/${newer.slug}`} className="group space-y-1">
                <span className="block text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
                  ← 上一篇
                </span>
                <span className="font-heading text-lg tracking-wide transition-colors group-hover:text-primary">
                  {newer.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {older && (
              <Link href={`/blog/${older.slug}`} className="group space-y-1 sm:text-right">
                <span className="block text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
                  下一篇 →
                </span>
                <span className="font-heading text-lg tracking-wide transition-colors group-hover:text-primary">
                  {older.title}
                </span>
              </Link>
            )}
          </nav>
        )}
      </article>
    </>
  );
}
