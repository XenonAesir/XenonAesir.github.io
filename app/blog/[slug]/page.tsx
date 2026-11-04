import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-6 pt-10 pb-20">
      <header className="mb-10 space-y-4">
        <h1 className="font-heading text-3xl font-light tracking-wide sm:text-4xl">{post.title}</h1>
        <time
          dateTime={post.date}
          className="block text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase"
        >
          {post.date}
        </time>
        <div className="hairline" />
      </header>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              rehypePlugins: [
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
    </article>
  );
}
