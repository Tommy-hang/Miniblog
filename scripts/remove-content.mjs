#!/usr/bin/env node
/**
 * Remove content or a tag, locally and deliberately.
 *
 * Deletion is destructive, so this tool never guesses: the target comes from
 * discovered content, the final step requires typing the exact slug, a tag
 * that is still referenced is refused, and the last tag cannot be removed.
 * Nothing is committed or pushed — Git stays the recovery layer and
 * `npm run publish` remains a separate, conscious step.
 */

import { readFileSync, rmSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import {
  CONTENT_DIR,
  LOCALES,
  createPrompter,
  listContent,
  parseFrontmatter,
  readTagRegistry,
  relativeFromRoot,
  removeTag,
} from "./content-utils.mjs";

const prompter = createPrompter();
const { ask, choose } = prompter;

class Cancelled extends Error {}
const cancel = (message) => {
  throw new Cancelled(message);
};

function readMeta(entry) {
  const { data } = parseFrontmatter(readFileSync(entry.file, "utf8"));
  return {
    title: typeof data.title === "string" && data.title.trim() ? data.title.trim() : entry.slug,
    draft: data.draft === true,
    status: typeof data.status === "string" ? data.status : undefined,
    tags: Array.isArray(data.tags) ? data.tags : [],
  };
}

const kindOf = (entry) => (entry.collection === "writing" ? "Writing" : "Project");

/**
 * The path(s) a given discovered entry maps to, with strict guards so only a
 * real bundle directory or legacy flat file under src/content can be removed.
 */
function removalTargets(entry) {
  const localeDir = resolve(CONTENT_DIR, entry.collection, entry.locale);
  const file = resolve(entry.file);

  if (dirname(file) !== localeDir) {
    const dir = dirname(file);
    const ok = dirname(dir) === localeDir && basename(dir) === entry.slug && /^index\.mdx?$/.test(basename(file));
    if (!ok) throw new Error(`Refusing to remove an unexpected path: ${relativeFromRoot(dir)}`);
    return { type: "bundle", dir };
  }

  const ok = basename(file).replace(/\.mdx?$/, "") === entry.slug;
  if (!ok) throw new Error(`Refusing to remove an unexpected path: ${relativeFromRoot(file)}`);
  return { type: "file", file };
}

function applyRemoval(targets) {
  if (targets.type === "bundle") rmSync(targets.dir, { recursive: true });
  else rmSync(targets.file);
}

function recoveryHint(removed) {
  const paths = removed.map((item) => `src/content/${item.collection}/${item.locale}/${item.slug}`);
  return `git restore -- ${paths.join(" ")}`;
}

function finishRemoval(removed) {
  console.log("\nRemoved locally:\n");
  for (const item of removed) console.log(`  ${item.title}\n  ${item.collection} · ${item.locale} · ${item.slug}`);
  console.log("\nNothing has been committed or pushed.");
  console.log("\nThis removal is still recoverable through Git until you publish it.\n");
  console.log(`  ${recoveryHint(removed)}`);
  console.log("\nNext:\n\n  Review:\n    npm run dev\n\n  Publish this removal:\n    npm run publish");
}

async function removeWritingOrProject(collection) {
  const noun = collection === "writing" ? "Writing" : "Project";
  const all = listContent().filter((entry) => entry.collection === collection);
  if (all.length === 0) {
    console.log(`\nNo ${noun} content exists.\nNothing to remove.`);
    return;
  }

  const locale = await choose("Language:", LOCALES.map((value) => ({ label: value, value })));
  const entries = all
    .filter((entry) => entry.locale === locale)
    .sort((a, b) => a.slug.localeCompare(b.slug));
  if (entries.length === 0) {
    console.log(`\nNo ${noun} content in ${locale}.\nNothing to remove.`);
    return;
  }

  const entry = await choose(
    `Select ${noun.toLowerCase()} to remove:`,
    entries.map((item) => {
      const meta = readMeta(item);
      const state = collection === "projects"
        ? `${item.slug} · ${meta.status ?? "no status"} · ${meta.draft ? "draft" : "published"}`
        : `${item.slug} · ${meta.draft ? "draft" : "published"}`;
      return { label: `${meta.title}\n     ${state}`, value: item };
    }).concat([{ label: "Cancel", value: null }]),
  );
  if (!entry) cancel("Removal cancelled.\nNo files were changed.");

  const meta = readMeta(entry);
  const targets = removalTargets(entry);
  const targetPath = targets.type === "bundle" ? targets.dir : targets.file;

  console.log(`\nRemove this ${kindOf(entry)}?\n`);
  console.log(`Title:\n  ${meta.title}\n`);
  console.log(`Language:\n  ${entry.locale}\n`);
  console.log(`Slug:\n  ${entry.slug}\n`);
  console.log(`Status:\n  ${meta.draft ? "draft" : "published"}\n`);
  console.log(`Path:\n  ${relativeFromRoot(targetPath)}${targets.type === "bundle" ? "/" : ""}\n`);
  if (targets.type === "bundle") {
    console.log("This removes the entire content bundle,\nincluding Markdown and local media.");
  }
  if (!meta.draft) {
    console.log("\nWarning\n\nThis content is already published.\nAfter the next `npm run publish`,\nits public URL will disappear and existing links may return 404.");
  }

  const other = entry.locale === "zh" ? "en" : "zh";
  const translation = listContent().find(
    (candidate) =>
      candidate.collection === entry.collection && candidate.locale === other && candidate.slug === entry.slug,
  );

  let alsoRemoveTranslation = false;
  if (translation) {
    const translationMeta = readMeta(translation);
    console.log(`\nA translation also exists:\n\n  ${other} · ${translationMeta.title}\n`);
    const answer = await choose("What should be removed?", [
      { label: `${entry.locale} only`, value: "one" },
      { label: `Both ${entry.locale} and ${other}`, value: "both" },
      { label: "Cancel", value: "cancel" },
    ]);
    if (answer === "cancel") cancel("Removal cancelled.\nNo files were changed.");
    alsoRemoveTranslation = answer === "both";
  }

  const typed = await ask(`\nType the slug to confirm deletion:\n\n  ${entry.slug}\n\n> `);
  if (typed !== entry.slug) {
    cancel("Removal cancelled.\nNo files were changed.");
  }

  const removed = [{ collection: entry.collection, locale: entry.locale, slug: entry.slug, title: meta.title }];
  applyRemoval(targets);
  if (alsoRemoveTranslation) {
    removed.push({
      collection: translation.collection,
      locale: translation.locale,
      slug: translation.slug,
      title: readMeta(translation).title,
    });
    applyRemoval(removalTargets(translation));
  }

  finishRemoval(removed);
}

async function removeTagFlow() {
  const registry = readTagRegistry();
  const usage = new Map(registry.map((tag) => [tag.slug, []]));

  for (const entry of listContent()) {
    for (const name of readMeta(entry).tags) {
      const tag = registry.find((candidate) => candidate.name === name);
      if (tag) usage.get(tag.slug).push(entry);
    }
  }

  const tag = await choose(
    "Select tag to remove:",
    registry.map((item) => {
      const count = usage.get(item.slug).length;
      return { label: `${item.name}  · used by ${count} ${count === 1 ? "item" : "items"}`, value: item };
    }).concat([{ label: "Cancel", value: null }]),
  );
  if (!tag) cancel("Removal cancelled.\nNo files were changed.");

  const used = usage.get(tag.slug);
  if (used.length > 0) {
    const lines = used
      .map((entry) => `  ${kindOf(entry)} · ${readMeta(entry).title}\n    ${relativeFromRoot(entry.file)}`)
      .join("\n");
    cancel(`Cannot remove "${tag.name}".\n\nIt is still used by ${used.length} content ${used.length === 1 ? "item" : "items"}:\n\n${lines}\n\nRemove or replace this tag from those items first,\nthen run:\n\n  npm run remove`);
  }

  if (registry.length === 1) {
    cancel("Cannot remove the final registered tag.\n\nMiniBlog requires a non-empty controlled vocabulary.");
  }

  console.log(`\nRemove tag?\n\n  ${tag.name} → ${tag.slug}\n\nThis will remove it from the controlled Tag Registry.`);
  const typed = await ask(`\nType the tag slug to confirm:\n\n  ${tag.slug}\n\n> `);
  if (typed !== tag.slug) {
    cancel("Removal cancelled.\nNo files were changed.");
  }

  removeTag(tag.slug);
  console.log(`\nRemoved locally:\n\n  ${tag.name} → ${tag.slug}`);
  console.log("\nNothing has been committed or pushed.");
  console.log("\nThis removal is still recoverable through Git until you publish it.\n");
  console.log("  git restore -- src/lib/tags.ts");
  console.log("\nNext:\n\n  Publish this removal:\n    npm run publish");
}

async function main() {
  console.log("MiniBlog · remove");
  const action = await choose("What do you want to remove?", [
    { label: "Writing", value: "writing" },
    { label: "Project", value: "projects" },
    { label: "Tag", value: "tag" },
    { label: "Cancel", value: null },
  ]);
  if (!action) cancel("Removal cancelled.\nNo files were changed.");
  if (action === "tag") await removeTagFlow();
  else await removeWritingOrProject(action);
}

process.on("SIGINT", () => {
  console.log("\nCancelled.\nNo additional changes were made.");
  process.exit(0);
});

main()
  .catch((error) => {
    if (error instanceof Cancelled) {
      console.log(`\n${error.message}`);
    } else {
      console.error(`\n${error.message}`);
      process.exitCode = 1;
    }
  })
  .finally(() => prompter.close());
