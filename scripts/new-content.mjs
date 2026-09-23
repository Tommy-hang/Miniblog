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

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  CONTENT_DIR,
  LOCALES,
  contentDir,
  contentFile,
  createPrompter,
  formatTags,
  isValidSlug,
  listContent,
  parseFrontmatter,
  readTagRegistry,
  registerTag,
  relativeFromRoot,
  slugify,
  today,
  validateTagName,
} from "./content-utils.mjs";

const { ask, confirm, close } = createPrompter();

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

/** Ask for a slug for a brand-new tag, rejecting invalid or duplicate slugs. */
async function askTagSlug(name, findBySlug) {
  const suggested = slugify(name);
  for (;;) {
    const answer = await ask(`Slug${suggested ? ` [${suggested}]` : ""}: `);
    const slug = answer || suggested;
    if (!slug) {
      console.log("A slug is required. Use lowercase ASCII, e.g. machine-learning.");
      continue;
    }
    if (!isValidSlug(slug)) {
      console.log(`"${slug}" is not valid. Use lowercase letters, numbers and single hyphens.`);
      continue;
    }
    const owner = findBySlug(slug);
    if (owner) {
      console.log(`Slug "${slug}" is already used by "${owner.name}".`);
      continue;
    }
    return slug;
  }
}

/**
 * Resolves a comma-separated tag input against the registry. Unknown tags are
 * offered for registration one at a time (default: no); declining restarts the
 * prompt. Returns the accepted canonical names plus any tags still to register.
 */
async function askTags() {
  const registry = readTagRegistry();
  const pending = [];
  const known = () => [...registry, ...pending];
  const findByName = (name) => known().find((tag) => tag.name.toLowerCase() === name.toLowerCase());
  const findBySlug = (slug) => known().find((tag) => tag.slug === slug);

  for (;;) {
    const answer = await ask(`Tags (comma separated, optional)\n  allowed: ${known().map((tag) => tag.name).join(", ")}\n> `);
    if (!answer) return { tags: [], pending };

    const names = [...new Set(answer.split(",").map((tag) => tag.trim()).filter(Boolean))];
    const before = pending.length;
    const accepted = [];
    let declined = false;

    for (const name of names) {
      const existing = findByName(name);
      if (existing) {
        accepted.push(existing.name);
        continue;
      }

      console.log(`\n"${name}" is not registered.`);
      const create = await confirm(`\nCreate this tag?\n\n  ${name} → ${slugify(name) || "?"}`, false);
      if (!create) {
        declined = true;
        break;
      }
      const slug = await askTagSlug(name, findBySlug);
      pending.push({ name, slug });
      accepted.push(name);
    }

    if (declined) {
      pending.length = before;
      console.log(`\nTag not created.\n\nPlease enter registered tags again.\n\nAvailable:\n  ${known().map((tag) => tag.name).join(", ")}`);
      continue;
    }

    return { tags: [...new Set(accepted)], pending };
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
  const { tags, pending } = await askTags();

  const dir = contentDir(collection, locale, slug);
  if (existsSync(dir) || existsSync(join(CONTENT_DIR, collection, locale, `${slug}.md`))) {
    return refuse(dir);
  }

  // Every condition is validated: register new tags, then write the content.
  for (const tag of pending) registerTag(tag.name, tag.slug);
  if (pending.length > 0) {
    console.log(`\nRegistered:\n${pending.map((tag) => `  ${tag.name} → ${tag.slug}`).join("\n")}`);
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

async function createTag() {
  const registry = readTagRegistry();
  const findBySlug = (slug) => registry.find((tag) => tag.slug === slug);

  for (;;) {
    const raw = await ask("\nTag name: ");
    const problem = validateTagName(raw);
    if (problem) {
      console.log(problem);
      continue;
    }

    const name = raw.trim();
    const existing = registry.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      console.log(`\nTag already exists:\n\n  ${existing.name} → ${existing.slug}`);
      return;
    }

    const slug = await askTagSlug(name, findBySlug);
    const confirmed = await confirm(`\nCreate tag?\n\n  ${name} → ${slug}`, false);
    if (!confirmed) {
      console.log("\nTag not created.");
      return;
    }

    registerTag(name, slug);
    console.log(`\nCreated tag:\n\n  ${name} → ${slug}`);
    console.log(`\nAvailable tags:\n${readTagRegistry().map((tag) => `  ${tag.name}`).join("\n")}`);
    return;
  }
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
    { label: "Tag", value: "tag" },
  ]);
  if (action === "translation") await createTranslation();
  else if (action === "tag") await createTag();
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
  .finally(() => close());
