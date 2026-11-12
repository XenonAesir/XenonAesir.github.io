export type ProjectMeta = {
  slug: string;
  name: string;
  summary: string;
  tags: string[];
  repo: string;
};

export const PROJECTS: ProjectMeta[] = [
  {
    slug: "tech-content-workbench",
    name: "星火内容 · 研究台",
    summary:
      "面向编辑团队的技术内容研究工作台：科技榜单入库、六维分析、今日选题与盲测评测。前后端完整实现，数据全部为合成数据。",
    tags: ["Flask", "Vue 3", "SQLite"],
    repo: "https://github.com/XenonAesir/tech-content-workbench",
  },
];
