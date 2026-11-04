import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
};

export type Post = PostMeta & { content: string };

function readPost(file: string): Post {
  const slug = path.basename(file, ".mdx");
  const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
  // YAML parses unquoted dates into Date objects; normalize so sorting stays stable
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");
  return {
    slug,
    title: String(data.title ?? slug),
    date,
    summary: String(data.summary ?? ""),
    content,
  };
}

function listFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith(".mdx"));
}

export function getAllPosts(): PostMeta[] {
  return listFiles()
    .map(readPost)
    .map(({ slug, title, date, summary }) => ({ slug, title, date, summary }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  const file = `${slug}.mdx`;
  if (!listFiles().includes(file)) return undefined;
  return readPost(file);
}
