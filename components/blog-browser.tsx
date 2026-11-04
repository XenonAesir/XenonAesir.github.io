"use client";

import { useMemo, useState } from "react";
import { PostCard } from "@/components/post-card";
import type { PostMeta } from "@/lib/posts";

// 每页条数；文章不超过 5 篇时不会出现翻页控件，想立刻看到可以改成 2
const PAGE_SIZE = 5;

function TagChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs tracking-[0.1em] transition-colors ${
        active
          ? "border-ring bg-accent text-accent-foreground"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function BlogBrowser({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const tags = useMemo(() => [...new Set(posts.flatMap((post) => post.tags))].sort(), [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (tag && !post.tags.includes(tag)) return false;
      if (!q) return true;
      return `${post.title} ${post.summary} ${post.tags.join(" ")}`.toLowerCase().includes(q);
    });
  }, [posts, query, tag]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function search(value: string) {
    setQuery(value);
    setPage(1);
  }

  function selectTag(next: string | null) {
    setTag(next);
    setPage(1);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="font-heading text-3xl font-light tracking-wide">博客</h1>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">共 {posts.length} 篇</p>
        <div className="hairline" />
      </div>

      <div className="space-y-4">
        <input
          type="search"
          value={query}
          onChange={(event) => search(event.target.value)}
          placeholder="搜索标题、摘要或标签"
          aria-label="搜索文章"
          className="w-full rounded-lg border border-border bg-card/50 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring"
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <TagChip active={tag === null} onClick={() => selectTag(null)}>
              全部
            </TagChip>
            {tags.map((name) => (
              <TagChip
                key={name}
                active={tag === name}
                onClick={() => selectTag(tag === name ? null : name)}
              >
                {name}
              </TagChip>
            ))}
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-sm font-light text-muted-foreground">
          没有匹配的文章。
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs tracking-[0.16em] uppercase">
          <button
            type="button"
            onClick={() => setPage(current - 1)}
            disabled={current === 1}
            className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            ← 上一页
          </button>
          <span className="text-muted-foreground">
            {current} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage(current + 1)}
            disabled={current === pageCount}
            className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            下一页 →
          </button>
        </div>
      )}
    </div>
  );
}
