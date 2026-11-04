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
    <div className="space-y-16">
      <section className="space-y-6">
        <Image
          src="/avatar.svg"
          alt="Xenon Aesir 的头像"
          width={84}
          height={84}
          className="rounded-full ring-1 ring-border shadow-[0_0_40px_rgba(114,168,216,0.35)] dark:shadow-[0_0_50px_rgba(114,168,216,0.25)]"
          priority
        />
        <div className="space-y-4">
          <h1 className="font-heading text-4xl font-light tracking-wide sm:text-5xl">
            Xenon Aesir
          </h1>
          <div className="hairline max-w-28" />
          <p className="max-w-xl text-[0.95rem] leading-7 font-light text-muted-foreground">
            写代码，也写字。这里记录我做过的东西和想明白的事。
          </p>
        </div>
        <div className="flex gap-6 text-xs tracking-[0.18em] uppercase">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 transition-colors hover:text-foreground"
            >
              {link.label}
              <ArrowUpRight className="size-3" />
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-2xl font-light tracking-wide">最新文章</h2>
          <Link
            href="/blog"
            className="text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            全部
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="font-light text-muted-foreground">还没有文章。</p>
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
