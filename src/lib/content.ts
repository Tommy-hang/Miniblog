import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/ui";

export type WritingEntry = CollectionEntry<"writing">;
export type ProjectEntry = CollectionEntry<"projects">;
export type ContentEntry = WritingEntry | ProjectEntry;

/**
 * Content entries live in locale folders:
 *   writing/zh/my-post/index.md  →  locale "zh", slug "my-post"
 * The folder is the single source of truth for language and slug,
 * so frontmatter never repeats them.
 */
export function localeOf(entry: ContentEntry): Locale {
  return entry.id.startsWith("en/") ? "en" : "zh";
}

export function slugOf(entry: ContentEntry): string {
  const withoutLocale = entry.id.replace(/^(zh|en)\//, "");
  return withoutLocale.replace(/\/index$/, "");
}

export async function publishedWriting(locale: Locale): Promise<WritingEntry[]> {
  const entries = await getCollection("writing", ({ data, id }) => {
    if (import.meta.env.PROD && data.draft) return false;
    return id.startsWith(`${locale}/`);
  });
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function publishedProjects(locale: Locale): Promise<ProjectEntry[]> {
  const entries = await getCollection("projects", ({ data, id }) => {
    if (import.meta.env.PROD && data.draft) return false;
    return id.startsWith(`${locale}/`);
  });
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Homepage picks featured first, newest first; falls back to latest when nothing is featured. */
export function featuredOrLatest<T extends ContentEntry>(entries: T[], limit: number): T[] {
  const featured = entries.filter((entry) => entry.data.featured);
  return (featured.length > 0 ? featured : entries).slice(0, limit);
}

/** Returns the same-slug entry in the other locale, if it exists. */
export async function translationOf(entry: ContentEntry): Promise<ContentEntry | undefined> {
  const collection = entry.collection === "writing" ? "writing" : "projects";
  const other: Locale = localeOf(entry) === "zh" ? "en" : "zh";
  const entries = await getCollection(collection, ({ id }) => id.startsWith(`${other}/`));
  const slug = slugOf(entry);
  return entries.find((candidate) => slugOf(candidate) === slug);
}

/**
 * English reading speed is measured in words; Chinese in characters.
 * CJK text carries roughly one idea per character, so ~400 characters
 * per minute is a calm, believable estimate. Mixed text counts both.
 */
export function readingTimeMinutes(body: string, locale: Locale): number {
  const cjkChars = (body.match(/[一-鿿　-〿＀-￯]/g) ?? []).length;
  const latinWords = body
    .replace(/[一-鿿　-〿＀-￯]/g, " ")
    .split(/\s+/)
    .filter((word) => /[A-Za-z0-9]/.test(word)).length;
  const minutes =
    locale === "zh" ? cjkChars / 400 + latinWords / 220 : latinWords / 220 + cjkChars / 400;
  return Math.max(1, Math.round(minutes));
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", {
    day: "numeric",
    month: locale === "zh" ? "long" : "short",
    year: "numeric",
  }).format(date);
}

/** "SEP 22, 2026" — compact uppercase label for editorial index rows. */
export function formatIndexDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", {
    day: "2-digit",
    month: locale === "zh" ? "long" : "short",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

export function formatYear(date: Date): string {
  return new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
}
