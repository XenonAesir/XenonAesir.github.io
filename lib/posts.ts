import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const isProd = process.env.NODE_ENV === "production";

const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  summary: z.string().default(""),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  tags: string[];
  minutes: number;
  draft: boolean;
};

export type Post = PostMeta & { content: string };

// 中文按 400 字/分钟、英文按 200 词/分钟估算
export function readingMinutes(content: string): number {
  const cjk = content.match(/[一-鿿]/g)?.length ?? 0;
  const latin = content.replace(/[一-鿿]/g, " ").match(/[A-Za-z0-9]+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(cjk / 400 + latin / 200));
}

function readPost(file: string): Post {
  const slug = path.basename(file, ".mdx");
  const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `content/posts/${file} 的 frontmatter 不合法：\n${z.prettifyError(parsed.error)}`,
    );
  }
  return {
    slug,
    title: parsed.data.title,
    date: parsed.data.date.toISOString().slice(0, 10),
    summary: parsed.data.summary,
    tags: parsed.data.tags,
    draft: parsed.data.draft,
    minutes: readingMinutes(content),
    content,
  };
}

function toMeta({ slug, title, date, summary, tags, minutes, draft }: Post): PostMeta {
  return { slug, title, date, summary, tags, minutes, draft };
}

function listFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith(".mdx"));
}

export function getAllPosts(): PostMeta[] {
  return listFiles()
    .map(readPost)
    .filter((post) => !isProd || !post.draft)
    .map(toMeta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  const file = `${slug}.mdx`;
  if (!listFiles().includes(file)) return undefined;
  const post = readPost(file);
  if (isProd && post.draft) return undefined;
  return post;
}

export function getAllTags(): string[] {
  return [...new Set(getAllPosts().flatMap((post) => post.tags))].sort();
}

// 列表按日期倒序，前一篇是更新的，后一篇是更旧的
export function getAdjacentPosts(slug: string): { newer?: PostMeta; older?: PostMeta } {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return { newer: posts[index - 1], older: posts[index + 1] };
}
