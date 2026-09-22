/**
 * Brand Language vs Content Language.
 *
 * The interface has a voice; the content has a language. All brand and UI
 * copy (navigation, section titles, footer, 404) is fixed English and lives
 * directly in the components. Only strings that belong to the content itself
 * follow the article's language — and this file holds just those.
 */

export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];

export const htmlLang: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en",
};

/** Quiet metadata marker used in indexes to show the content's language. */
export const contentLanguageLabel: Record<Locale, string> = {
  zh: "ZH",
  en: "EN",
};

export interface ContentStrings {
  readingTime: (min: number) => string;
  published: string;
  updated: string;
  written: string;
  allWriting: string;
  allProjects: string;
  visitRepo: string;
  visitDemo: string;
  essay: string;
  piece: string;
}

const zh: ContentStrings = {
  readingTime: (min: number) => `约 ${min} 分钟`,
  published: "发布于",
  updated: "更新于",
  written: "写于",
  allWriting: "← 所有文章",
  allProjects: "← 所有项目",
  visitRepo: "源代码",
  visitDemo: "在线预览",
  essay: "随笔",
  piece: "作品",
};

const en: ContentStrings = {
  readingTime: (min: number) => `${min} min read`,
  published: "Published",
  updated: "Updated",
  written: "Written",
  allWriting: "← All writing",
  allProjects: "← All projects",
  visitRepo: "Source",
  visitDemo: "Live demo",
  essay: "Essay",
  piece: "Work",
};

export function contentStrings(locale: Locale): ContentStrings {
  return locale === "zh" ? zh : en;
}
