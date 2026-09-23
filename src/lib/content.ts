import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/ui";
import { tags, type Tag } from "./tags";

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

/**
 * Newest first. Ties fall back to title, then content id, so the archive
 * order is deterministic no matter what order the loader returns entries in.
 */
const byDateDesc = <T extends ContentEntry>(a: T, b: T) =>
  b.data.date.valueOf() - a.data.date.valueOf() ||
  a.data.title.localeCompare(b.data.title) ||
  a.id.localeCompare(b.id);

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

/**
 * Homepage curation: only entries the author explicitly marked `featured: true`
 * appear, in their existing (newest-first) order. There is deliberately no
 * "fall back to latest" rule — Selected means selected.
 */
export function featuredEntries<T extends ContentEntry>(entries: T[], limit: number): T[] {
  return entries.filter((entry) => entry.data.featured).slice(0, limit);
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

/** "22" — the day shown in the archive's leading column. */
export function formatDay(date: Date): string {
  return new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
}

/** "SEP" — the English month label used as an archive heading. */
export function formatMonthShort(date: Date): string {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(date).toUpperCase();
}

export interface WritingMonthGroup {
  month: string;
  entries: WritingEntry[];
}

export interface WritingYearGroup {
  year: string;
  months: WritingMonthGroup[];
}

/**
 * Groups an already-sorted list of writing into year → month → entries.
 * Insertion order follows the input (newest first), so years and months come
 * out in descending order without any extra sorting.
 */
export function groupWritingByYear(entries: WritingEntry[]): WritingYearGroup[] {
  const years = new Map<string, Map<string, WritingEntry[]>>();
  for (const entry of entries) {
    const year = formatYear(entry.data.date);
    const month = formatMonthShort(entry.data.date);
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year)!;
    if (!months.has(month)) months.set(month, []);
    months.get(month)!.push(entry);
  }
  return [...years].map(([year, months]) => ({
    year,
    months: [...months].map(([month, entries]) => ({ month, entries })),
  }));
}

/**
 * Registry-ordered tags that at least one entry actually uses, returned as
 * registry objects so callers can read `slug` without a second lookup.
 */
export function tagsInUse(entries: ContentEntry[]): Tag[] {
  const used = new Set(entries.flatMap((entry) => entry.data.tags));
  return tags.filter((tag) => used.has(tag.name));
}
