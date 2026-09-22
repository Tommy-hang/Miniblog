export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];

export const htmlLang: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en",
};

export interface UIStrings {
  navWriting: string;
  navProjects: string;
  navAbout: string;
  skipToContent: string;
  switchLang: string;
  selectedWriting: string;
  selectedProjects: string;
  viewAllWriting: string;
  viewAllProjects: string;
  writingCount: string;
  projectsCount: string;
  archive: string;
  heroLabel: string;
  heroTop: string;
  heroEm: string;
  currently: string;
  currentlyNote: string;
  readingTime: (min: number) => string;
  published: string;
  updated: string;
  allWriting: string;
  allProjects: string;
  endNote: string;
  visitRepo: string;
  visitDemo: string;
  essay: string;
  piece: string;
  notFoundLabel: string;
  notFoundBody: string;
  returnHome: string;
  builtWith: string;
  footerNav: string;
  primaryNav: string;
  writingSection: string;
  projectsSection: string;
  siteDescription: string;
}

const zh: UIStrings = {
  navWriting: "文章",
  navProjects: "项目",
  navAbout: "关于",
  skipToContent: "跳到正文",
  switchLang: "EN",
  selectedWriting: "精选文章",
  selectedProjects: "精选项目",
  viewAllWriting: "查看完整目录",
  viewAllProjects: "查看全部项目",
  writingCount: "篇",
  projectsCount: "个",
  archive: "目录",
  heroLabel: "独立笔记 · 第 01 期",
  heroTop: "公开地",
  heroEm: "思考。",
  currently: "最近在做什么",
  currentlyNote: "一则简短的现场笔记。",
  readingTime: (min: number) => `约 ${min} 分钟`,
  published: "发布于",
  updated: "更新于",
  allWriting: "← 所有文章",
  allProjects: "← 所有项目",
  endNote: "全文完",
  visitRepo: "源代码",
  visitDemo: "在线预览",
  essay: "随笔",
  piece: "作品",
  notFoundLabel: "错误 · 404",
  notFoundBody: "页面可能已被移动，或者它从未存在过。",
  returnHome: "返回首页",
  builtWith: "用好奇心构建。",
  footerNav: "页脚导航",
  primaryNav: "主导航",
  writingSection: "全部文章",
  projectsSection: "全部项目",
  siteDescription:
    "一个关于技术、设计与做好小事所需的小系统的安静出版物。",
};

const en: UIStrings = {
  navWriting: "Writing",
  navProjects: "Projects",
  navAbout: "About",
  skipToContent: "Skip to content",
  switchLang: "中文",
  selectedWriting: "Selected Writing",
  selectedProjects: "Selected Projects",
  viewAllWriting: "View the complete index",
  viewAllProjects: "View all projects",
  writingCount: "pieces",
  projectsCount: "works",
  archive: "Archive",
  heroLabel: "Independent notes · Index 01",
  heroTop: "Thinking",
  heroEm: "in public.",
  currently: "Currently",
  currentlyNote: "A short field note.",
  readingTime: (min: number) => `${min} min read`,
  published: "Published",
  updated: "Updated",
  allWriting: "← All writing",
  allProjects: "← All projects",
  endNote: "End note",
  visitRepo: "Source",
  visitDemo: "Live demo",
  essay: "Essay",
  piece: "Work",
  notFoundLabel: "Error · 404",
  notFoundBody: "The page may have moved, or perhaps it never existed.",
  returnHome: "Return home",
  builtWith: "Built with curiosity.",
  footerNav: "Footer navigation",
  primaryNav: "Primary navigation",
  writingSection: "All writing",
  projectsSection: "All projects",
  siteDescription:
    "A quiet publication about technology, design, and the small systems behind good work.",
};

export const ui: Record<Locale, UIStrings> = { zh, en };

export function t(locale: Locale): UIStrings {
  return ui[locale];
}
