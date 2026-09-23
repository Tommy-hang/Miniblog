#!/usr/bin/env node
/**
 * Curate the homepage: Selected Writing and Selected Projects.
 *
 * "Selected" means selected by the author, so this only ever flips the
 * `featured` boolean in existing frontmatter — it never creates, deletes or
 * reorders content, and it never touches drafts. The homepage shows at most
 * three entries per collection, so the tool enforces that limit by offering a
 * replace instead of silently hiding a fourth choice.
 *
 * Nothing is committed or pushed: review with `npm run dev`, then publish.
 */

import { readFileSync } from "node:fs";
import {
  createPrompter,
  listContent,
  parseFrontmatter,
  setFrontmatterBoolean,
} from "./content-utils.mjs";

const MAX = 3;
const prompter = createPrompter();
const { choose, confirm } = prompter;

const LABELS = {
  writing: { kind: "Writing", noun: "writing" },
  projects: { kind: "Projects", noun: "project" },
};

class Cancelled extends Error {}
const cancel = (message) => {
  throw new Cancelled(message);
};

const cancelOption = () => ({ label: "Cancel", value: null });
const localeLabel = (locale) => (locale === "en" ? "EN" : "ZH");

function dateValue(value) {
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

/** "SEP 22, 2026" — the archive's editorial date label. */
function formatDate(value) {
  const time = dateValue(value);
  if (time === 0) return value || "no date";
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(time))
    .toUpperCase();
}

function readMeta(entry) {
  const { data } = parseFrontmatter(readFileSync(entry.file, "utf8"));
  return {
    title: typeof data.title === "string" && data.title.trim() ? data.title.trim() : entry.slug,
    draft: data.draft === true,
    featured: data.featured === true,
    date: typeof data.date === "string" ? data.date : "",
  };
}

/** Every published (non-draft) entry of a collection, newest first. */
function publishedItems(collection) {
  return listContent()
    .filter((entry) => entry.collection === collection)
    .map((entry) => ({ entry, ...readMeta(entry) }))
    .filter((item) => !item.draft)
    .sort(
      (a, b) =>
        dateValue(b.date) - dateValue(a.date) ||
        a.title.localeCompare(b.title) ||
        a.entry.locale.localeCompare(b.entry.locale),
    );
}

const selectedItems = (collection) => publishedItems(collection).filter((item) => item.featured);

function candidateOption(item) {
  return {
    label: `${item.title}\n     ${localeLabel(item.entry.locale)} · ${formatDate(item.date)} · ${item.entry.slug}`,
    value: item,
  };
}

function selectedOption(item) {
  return {
    label: `${item.title}\n     ${localeLabel(item.entry.locale)} · ${item.entry.slug}`,
    value: item,
  };
}

function showCurrent(collection, selected) {
  const { kind, noun } = LABELS[collection];
  if (selected.length === 0) {
    console.log(`\nNo ${noun} is currently selected.`);
  } else {
    console.log(`\nCurrent Selected ${kind}\n`);
    selected.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.title}`);
      console.log(`     ${localeLabel(item.entry.locale)} · ${item.entry.slug}\n`);
    });
  }
  console.log(`${selected.length} / ${MAX} selected`);
}

function printSelection(collection) {
  const { kind } = LABELS[collection];
  const selected = selectedItems(collection);
  console.log(`Selected ${kind}:\n`);
  if (selected.length === 0) {
    console.log("  (none)");
  } else {
    selected.forEach((item, index) => console.log(`  ${index + 1}. ${item.title}`));
  }
  console.log(`\n${selected.length} / ${MAX} selected`);
}

function finish() {
  console.log("\nNothing has been committed or pushed.\n");
  console.log("Next:");
  console.log("  npm run dev");
  console.log("  npm run publish");
}

async function addFlow(collection, published, selected) {
  const { kind } = LABELS[collection];
  const available = published.filter((item) => !item.featured);

  if (available.length === 0) {
    console.log(`\nEvery published ${kind} is already selected.`);
    console.log("\nNothing was changed.");
    return;
  }

  if (selected.length >= MAX) {
    await replaceFlow(collection, selected, available);
    return;
  }

  const chosen = await choose(`Choose ${kind}:`, available.map(candidateOption).concat(cancelOption()));
  if (!chosen) cancel("Cancelled.\nNothing was changed.");

  const confirmed = await confirm(
    `\nAdd to Selected ${kind}?\n\n  ${chosen.title}\n  ${localeLabel(chosen.entry.locale)} · ${chosen.entry.slug}\n`,
    false,
  );
  if (!confirmed) cancel("Cancelled.\nNothing was changed.");

  setFrontmatterBoolean(chosen.entry.file, "featured", true);
  console.log(`\nAdded to homepage:\n\n  ${chosen.title}\n`);
  printSelection(collection);
  finish();
}

async function replaceFlow(collection, selected, available) {
  const { kind } = LABELS[collection];
  console.log(`\nSelected ${kind} is full (${MAX} / ${MAX}).\n`);

  const outgoing = await choose(
    "Choose one to replace:",
    selected.map(selectedOption).concat(cancelOption()),
  );
  if (!outgoing) cancel("Cancelled.\nNothing was changed.");

  const incoming = await choose(`Choose ${kind} to add:`, available.map(candidateOption).concat(cancelOption()));
  if (!incoming) cancel("Cancelled.\nNothing was changed.");

  const confirmed = await confirm(
    `\nReplace:\n\n  ${outgoing.title}\n  ${localeLabel(outgoing.entry.locale)} · ${outgoing.entry.slug}\n\nwith:\n\n  ${incoming.title}\n  ${localeLabel(incoming.entry.locale)} · ${incoming.entry.slug}\n`,
    false,
  );
  if (!confirmed) cancel("Cancelled.\nNothing was changed.");

  setFrontmatterBoolean(outgoing.entry.file, "featured", false);
  setFrontmatterBoolean(incoming.entry.file, "featured", true);
  console.log("\nHomepage selection updated.\n");
  printSelection(collection);
  finish();
}

async function removeFlow(collection, selected) {
  const { kind, noun } = LABELS[collection];

  if (selected.length === 0) {
    console.log(`\nNo ${noun} is currently selected.`);
    console.log("\nNothing was changed.");
    return;
  }

  const target = await choose(
    `Choose ${kind} to remove from homepage:`,
    selected.map(selectedOption).concat(cancelOption()),
  );
  if (!target) cancel("Cancelled.\nNothing was changed.");

  const confirmed = await confirm(
    `\nRemove from Selected ${kind}?\n\n  ${target.title}\n\nThe article itself will NOT be deleted.\n`,
    false,
  );
  if (!confirmed) cancel("Cancelled.\nNothing was changed.");

  setFrontmatterBoolean(target.entry.file, "featured", false);
  console.log(`\nRemoved from homepage:\n\n  ${target.title}\n`);
  printSelection(collection);
  finish();
}

async function manage(collection) {
  const { kind } = LABELS[collection];
  const published = publishedItems(collection);
  if (published.length === 0) {
    console.log(`\nNo published ${kind} is available to feature.`);
    return;
  }

  const selected = published.filter((item) => item.featured);
  showCurrent(collection, selected);

  const action = await choose("What do you want to do?", [
    { label: "Add to homepage", value: "add" },
    { label: "Remove from homepage", value: "remove" },
    { label: "Cancel", value: null },
  ]);
  if (!action) cancel("Cancelled.\nNothing was changed.");

  if (action === "add") await addFlow(collection, published, selected);
  else await removeFlow(collection, selected);
}

async function main() {
  console.log("MiniBlog · featured");
  const collection = await choose("What do you want to manage?", [
    { label: "Selected Writing", value: "writing" },
    { label: "Selected Projects", value: "projects" },
    { label: "Cancel", value: null },
  ]);
  if (!collection) cancel("Cancelled.\nNothing was changed.");
  await manage(collection);
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
