/**
 * The controlled tag vocabulary.
 *
 * Tags are MiniBlog's second discovery axis (the first is time). They are a
 * knowledge-navigation tool, not SEO keywords, so the vocabulary stays small,
 * English, and shared across Writing and Projects. Registering them here lets
 * the content schema reject typos at build time and keeps slugs stable.
 */

export const tags = [
  { name: "AI", slug: "ai" },
  { name: "Engineering", slug: "engineering" },
  { name: "Design", slug: "design" },
  { name: "Workflow", slug: "workflow" },
  { name: "Web", slug: "web" },
] as const satisfies readonly { name: string; slug: string }[];

export type Tag = (typeof tags)[number];
export type TagName = Tag["name"];

/** Non-empty tuple for `z.enum`, so content can only use registered tags. */
export const tagNames = tags.map((tag) => tag.name) as [TagName, ...TagName[]];

export function tagSlug(name: string): string | undefined {
  return tags.find((tag) => tag.name === name)?.slug;
}
