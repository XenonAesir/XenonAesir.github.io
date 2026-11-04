// 部署到 Vercel 后把 NEXT_PUBLIC_SITE_URL 设成正式域名，RSS 和 sitemap 才算得对
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_TITLE = "Xenon Aesir";
export const SITE_DESCRIPTION = "Xenon Aesir 的个人主页与博客。";
