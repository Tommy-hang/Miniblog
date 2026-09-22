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

const byDateDesc = <T extends ContentEntry>(a: T, b: T) =>
  b.data.date.valueOf() - a.data.date.valueOf();

/**
 * Drafts are hidden in production but stay previewable in `npm run dev`.
 * Every published lookup must pass through this rule so a draft translation
 * is never treated as an accessible counterpart.
 */
function isVisible({ data }: { data: { draft: boolean } }): boolean {
  return !(import.meta.env.PROD && data.draft);
}

/** Every published writing entry, both languages, newest first. */
export async function allWriting(): Promise<WritingEntry[]> {
  const entries = await getCollection("writing", isVisible);
  return entries.sort(byDateDesc);
}

/** Every published project entry, both languages, newest first. */
export async function allProjects(): Promise<ProjectEntry[]> {
  const entries = await getCollection("projects", isVisible);
  return entries.sort(byDateDesc);
}

export async function publishedWriting(locale: Locale): Promise<WritingEntry[]> {
  const entries = await getCollection(
    "writing",
    ({ data, id }) => isVisible({ data }) && id.startsWith(`${locale}/`),
  );
  return entries.sort(byDateDesc);
}

export async function publishedProjects(locale: Locale): Promise<ProjectEntry[]> {
  const entries = await getCollection(
    "projects",
    ({ data, id }) => isVisible({ data }) && id.startsWith(`${locale}/`),
  );
  return entries.sort(byDateDesc);
}

/** Homepage picks featured first, newest first; falls back to latest when nothing is featured. */
export function featuredOrLatest<T extends ContentEntry>(entries: T[], limit: number): T[] {
  const featured = entries.filter((entry) => entry.data.featured);
  return (featured.length > 0 ? featured : entries).slice(0, limit);
}

/** Returns the published same-slug entry in the other locale, if it exists. */
export async function translationOf(entry: ContentEntry): Promise<ContentEntry | undefined> {
  const collection = entry.collection === "writing" ? "writing" : "projects";
  const other: Locale = localeOf(entry) === "zh" ? "en" : "zh";
  const entries = await getCollection(
    collection,
    ({ data, id }) => isVisible({ data }) && id.startsWith(`${other}/`),
  );
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

/** "September 2026" / "2026年9月" — the quiet colophon signature. */
export function formatMonthYear(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", {
    month: "long",
    year: "numeric",
  }).format(date);
}

/** "SEP 22, 2026" — one English editorial label for every archive row. */
export function formatIndexDate(date: Date): string {
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" })
    .format(date)
    .toUpperCase();
}

export function formatYear(date: Date): string {
  return new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
}
