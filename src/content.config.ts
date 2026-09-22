import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { tagNames } from "./lib/tags";

const baseFields = {
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  // Only registered tags are allowed, so a typo fails the build instead of
  // silently creating a new `/tags/<typo>/` page.
  tags: z.array(z.enum(tagNames)).default([]),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
};

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: ({ image }) =>
    z.object({
      ...baseFields,
      updated: z.coerce.date().optional(),
      cover: image().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      ...baseFields,
      updated: z.coerce.date().optional(),
      status: z.string().optional(),
      cover: image().optional(),
      repo: z.url().optional(),
      demo: z.url().optional(),
    }),
});

export const collections = { writing, projects };
