import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const baseFields = {
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
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
