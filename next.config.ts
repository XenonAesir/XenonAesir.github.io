import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 部署到 GitHub Pages 只能托管静态文件
  output: "export",
  // cacheComponents 会让静态动态路由也强制走 Suspense，纯静态博客不需要
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
