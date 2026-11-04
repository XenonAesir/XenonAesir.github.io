import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";

const links = [
  { label: "GitHub", href: "https://github.com/XenonAesir" },
  { label: "邮箱", href: "mailto:xenonaesir@foxmail.com" },
];

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="space-y-14">
      <section className="space-y-5">
        <Image
          src="/avatar.svg"
          alt="Xenon Aesir 的头像"
          width={80}
          height={80}
          className="rounded-full"
          priority
        />
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Xenon Aesir</h1>
          <p className="max-w-xl leading-7 text-muted-foreground">
            写代码，也写字。这里记录我做过的东西和想明白的事。
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {link.label}
              <ArrowUpRight className="size-3.5" />
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight">最新文章</h2>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
            全部
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">还没有文章。</p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
