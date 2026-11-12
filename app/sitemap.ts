import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { PROJECTS } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

// output: "export" 下路由必须显式声明静态
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    ...PROJECTS.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getAllPosts().map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
