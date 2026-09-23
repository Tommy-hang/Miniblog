#!/usr/bin/env node
/**
 * Content integrity check.
 *
 * This is intentionally narrow. Astro + Zod already validate field types,
 * required fields, the tag vocabulary and image references, so this script
 * does NOT repeat any of that. It only covers cross-content rules that a
 * per-file schema cannot see: duplicate identities, translation structure,
 * date ordering, and published-vs-draft quality.
 *
 * Read-only: it reports, it never edits content. Exits non-zero on errors so
 * CI can block a deployment.
 */

import { readFileSync } from "node:fs";
import {
  isValidSlug,
  listContent,
  parseFrontmatter,
  relativeFromRoot,
} from "./content-utils.mjs";

const errors = [];
const warnings = [];

const entries = listContent();

const writing = entries.filter((entry) => entry.collection === "writing");
const projects = entries.filter((entry) => entry.collection === "projects");

// --- Duplicate identity (collection + locale + slug) ------------------------
const seen = new Map();
for (const entry of entries) {
  const id = `${entry.collection}/${entry.locale}/${entry.slug}`;
  if (seen.has(id)) {
    errors.push(`${id}: duplicate content identity (${relativeFromRoot(seen.get(id))} and ${relativeFromRoot(entry.file)})`);
  } else {
    seen.set(id, entry.file);
  }
}

// --- Per-entry integrity ----------------------------------------------------
const counts = {
  writing: { published: 0, draft: 0 },
  projects: { published: 0, draft: 0 },
};
const featuredPublished = { writing: 0, projects: 0 };
const tagsInUse = new Set();
const byCollectionSlug = new Map();

for (const entry of entries) {
  const id = `${entry.collection}/${entry.locale}/${entry.slug}`;
  const { data, body } = parseFrontmatter(readFileSync(entry.file, "utf8"));

  const draft = data.draft === true;
  const featured = data.featured === true;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description = typeof data.description === "string" ? data.description.trim() : "";
  const date = typeof data.date === "string" ? data.date : "";
  const updated = typeof data.updated === "string" ? data.updated : "";

  counts[entry.collection][draft ? "draft" : "published"] += 1;
  if (!draft && featured) featuredPublished[entry.collection] += 1;
  if (Array.isArray(data.tags)) for (const tag of data.tags) tagsInUse.add(tag);

  const key = `${entry.collection}/${entry.slug}`;
  if (!byCollectionSlug.has(key)) byCollectionSlug.set(key, new Set());
  byCollectionSlug.get(key).add(entry.locale);

  if (!draft && !title) {
    errors.push(`${id}: published content has an empty title`);
  }
  if (!draft && !description) {
    errors.push(`${id}: published content has an empty description`);
  }
  if (date && updated && updated < date) {
    errors.push(`${id}: updated (${updated}) is before date (${date})`);
  }

  if (draft && featured) {
    warnings.push(`${id}: draft content is marked featured (it will not appear on the homepage)`);
  }
  if (!draft && body.replace(/\s+/g, "").length === 0) {
    warnings.push(`${id}: published content has an empty body`);
  }
  if (!isValidSlug(entry.slug)) {
    warnings.push(`${id}: slug "${entry.slug}" is not lowercase kebab-case`);
  }
  if (/(?:^|-)(?:en|zh)(?:-version|-translation)?$/.test(entry.slug)) {
    warnings.push(`${id}: slug ends with a locale suffix; translations pair by an identical slug`);
  }
}

const translationPairs = [...byCollectionSlug.values()].filter(
  (locales) => locales.has("zh") && locales.has("en"),
).length;

// --- Homepage curation limit ------------------------------------------------
const HOMEPAGE_LIMIT = 3;
for (const collection of ["writing", "projects"]) {
  if (featuredPublished[collection] > HOMEPAGE_LIMIT) {
    errors.push(
      `${collection}: ${featuredPublished[collection]} published items are marked featured, but the homepage limit is ${HOMEPAGE_LIMIT}`,
    );
  }
}

// --- Report -----------------------------------------------------------------
const pad = (label, width = 18) => label.padEnd(width);
console.log("Content validation\n");
console.log(`  ${pad("writings")}${writing.length} (${counts.writing.published} published, ${counts.writing.draft} draft)`);
console.log(`  ${pad("projects")}${projects.length} (${counts.projects.published} published, ${counts.projects.draft} draft)`);
console.log(`  ${pad("tags in use")}${tagsInUse.size}`);
console.log(`  ${pad("translation pairs")}${translationPairs}`);

if (warnings.length > 0) {
  console.log("\nWarnings");
  for (const warning of warnings) console.log(`  - ${warning}`);
}
if (errors.length > 0) {
  console.log("\nErrors");
  for (const error of errors) console.log(`  - ${error}`);
}

console.log(`\n${errors.length} error${errors.length === 1 ? "" : "s"}, ${warnings.length} warning${warnings.length === 1 ? "" : "s"}`);

if (errors.length > 0) {
  process.exitCode = 1;
}
