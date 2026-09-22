#!/usr/bin/env node
/**
 * Create new content or a translation, interactively.
 *
 * This only scaffolds a folder + `index.md` that matches the real content
 * schema. New content always starts as `draft: true`, nothing is committed,
 * and an existing folder is never overwritten.
 *
 * Input is read through a small line queue rather than `rl.question`, so the
 * prompts work both on a real terminal and with piped input.
 */

import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  CONTENT_DIR,
  LOCALES,
  contentDir,
  contentFile,
  formatTags,
  isValidSlug,
  listContent,
  parseFrontmatter,
  readTagRegistry,
  relativeFromRoot,
  slugify,
  today,
} from "./content-utils.mjs";

const rl = createInterface({ input: stdin, output: stdout, terminal: false });
const queue = [];
const waiters = [];
let closed = false;

rl.on("line", (line) => {
  const waiter = waiters.shift();
  if (waiter) waiter(line);
  else queue.push(line);
});
rl.on("close", () => {
  closed = true;
  let waiter;
  while ((waiter = waiters.shift())) waiter(null);
});

function nextLine() {
  if (queue.length > 0) return Promise.resolve(queue.shift());
  if (closed) return Promise.resolve(null);
  return new Promise((resolve) => waiters.push(resolve));
}

async function ask(question) {
  stdout.write(question);
  const line = await nextLine();
  if (line === null) throw new Error("Input ended before the prompt was answered.");
  return line.trim();
}

async function choose(question, options) {
  console.log(`\n${question}`);
  options.forEach((option, index) => console.log(`  ${index + 1}. ${option.label}`));
  for (;;) {
    const answer = await ask("> ");
    const index = Number(answer) - 1;
    if (Number.isInteger(index) && index >= 0 && index < options.length) return options[index].value;
    console.log(`Please enter a number between 1 and ${options.length}.`);
  }
}

async function askTitle() {
  for (;;) {
    const title = await ask("\nTitle: ");
    if (title) return title;
    console.log("A title is required.");
  }
}

async function askSlug(suggested) {
  for (;;) {
    const answer = await ask(`Slug${suggested ? ` [${suggested}]` : ""}: `);
    const slug = answer || suggested;
    if (!slug) {
      console.log("A slug is required. Use lowercase ASCII, e.g. understanding-attention.");
      continue;
    }
    if (!isValidSlug(slug)) {
      console.log(`"${slug}" is not valid. Use lowercase letters, numbers and single hyphens.`);
      continue;
    }
    return slug;
  }
}

async function askTags() {
  const allowed = readTagRegistry().map((tag) => tag.name);
  for (;;) {
    const answer = await ask(`Tags (comma separated, optional)\n  allowed: ${allowed.join(", ")}\n> `);
    if (!answer) return [];
    const tags = answer.split(",").map((tag) => tag.trim()).filter(Boolean);
    const unknown = tags.filter((tag) => !allowed.includes(tag));
    if (unknown.length > 0) {
      console.log(`Unknown tag(s): ${unknown.join(", ")}. Register them in src/lib/tags.ts first.`);
      continue;
    }
    return [...new Set(tags)];
  }
}

function writingTemplate({ title, date, tags }) {
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ""\ndate: ${date}\n${formatTags(tags)}\ndraft: true\nfeatured: false\n---\n`;
}

function projectTemplate({ title, date, tags }) {
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ""\ndate: ${date}\n${formatTags(tags)}\nstatus: active\ndraft: true\nfeatured: false\n---\n`;
}

function refuse(path) {
  console.log(`\nRefusing to overwrite: ${relativeFromRoot(path)} already exists.`);
  process.exitCode = 1;
}

function nextSteps(first, second) {
  console.log(`\nNext:\n  1. ${first}\n  2. ${second}\n  3. Add images beside index.md\n  4. Set draft: false when ready`);
}

async function createContent(collection) {
  const locale = await choose("Language:", LOCALES.map((value) => ({ label: value, value })));
  const title = await askTitle();
  const slug = await askSlug(slugify(title));
  const tags = await askTags();

  const dir = contentDir(collection, locale, slug);
  if (existsSync(dir) || existsSync(join(CONTENT_DIR, collection, locale, `${slug}.md`))) {
    return refuse(dir);
  }

  const date = today();
  const content = collection === "writing"
    ? writingTemplate({ title, date, tags })
    : projectTemplate({ title, date, tags });

  mkdirSync(dir, { recursive: true });
  const file = contentFile(collection, locale, slug);
  writeFileSync(file, content, "utf8");

  console.log(`\nCreated:\n  ${relativeFromRoot(file)}`);
  nextSteps("Write the description", "Add the content");
}

async function createTranslation() {
  const collection = await choose("Content type:", [
    { label: "Writing", value: "writing" },
    { label: "Project", value: "projects" },
  ]);
  const sourceLocale = await choose("Source locale:", LOCALES.map((value) => ({ label: value, value })));

  const available = listContent()
    .filter((entry) => entry.collection === collection && entry.locale === sourceLocale)
    .map((entry) => entry.slug);
  if (available.length > 0) console.log(`\nExisting slugs: ${available.join(", ")}`);

  const slug = await askSlug("");
  const targetLocale = await choose("Target locale:", LOCALES.map((value) => ({ label: value, value })));

  if (sourceLocale === targetLocale) {
    console.log("\nSource and target locales must differ.");
    process.exitCode = 1;
    return;
  }

  const sourceFile = contentFile(collection, sourceLocale, slug);
  if (!existsSync(sourceFile)) {
    console.log(`\nNo source content at ${relativeFromRoot(sourceFile)}.`);
    process.exitCode = 1;
    return;
  }

  const targetDir = contentDir(collection, targetLocale, slug);
  if (existsSync(targetDir) || existsSync(join(CONTENT_DIR, collection, targetLocale, `${slug}.md`))) {
    return refuse(targetDir);
  }

  const { data } = parseFrontmatter(readFileSync(sourceFile, "utf8"));
  const title = typeof data.title === "string" ? data.title : slug;
  const date = typeof data.date === "string" ? data.date : today();
  const tags = Array.isArray(data.tags) ? data.tags : [];
  const status = collection === "projects" && typeof data.status === "string" ? data.status : undefined;

  const lines = [
    "---",
    `title: ${JSON.stringify(`TODO: translate — ${title}`)}`,
    `description: ""`,
    `date: ${date}`,
    formatTags(tags),
  ];
  if (status) lines.push(`status: ${status}`);
  lines.push("draft: true", "featured: false", "---", "");
  const content = `${lines.join("\n")}\n`;

  mkdirSync(targetDir, { recursive: true });
  const targetFile = contentFile(collection, targetLocale, slug);
  writeFileSync(targetFile, content, "utf8");

  console.log(`\nCreated:\n  ${relativeFromRoot(targetFile)}`);
  console.log(`\nCopied from:\n  ${relativeFromRoot(sourceFile)} (date, tags${status ? ", status" : ""}; title and body are placeholders)`);
  nextSteps("Translate the title and description", "Translate the body");
}

async function main() {
  console.log("MiniBlog · new content");
  const action = await choose("What do you want to create?", [
    { label: "Writing", value: "writing" },
    { label: "Project", value: "projects" },
    { label: "Translation of existing content", value: "translation" },
  ]);
  if (action === "translation") await createTranslation();
  else await createContent(action);
}

process.on("SIGINT", () => {
  console.log("\nCancelled.");
  process.exit(0);
});

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => rl.close());
