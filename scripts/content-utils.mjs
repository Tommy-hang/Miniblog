/**
 * Shared helpers for the local content scripts.
 *
 * These are deliberately tiny: the scripts read the same Markdown files the
 * author edits and never introduce a second schema. Astro + Zod remain the
 * authority for field types; this module only understands the small, stable
 * frontmatter subset MiniBlog actually uses.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const CONTENT_DIR = join(ROOT, "src", "content");
export const TAGS_FILE = join(ROOT, "src", "lib", "tags.ts");

export const COLLECTIONS = ["writing", "projects"];
export const LOCALES = ["zh", "en"];

/**
 * Reads the canonical tag vocabulary straight from `src/lib/tags.ts`, so the
 * registry stays the single source of truth. The file's shape is a contract:
 * `{ name: "...", slug: "..." }` entries, one per registered tag.
 */
export function readTagRegistry() {
  const source = readFileSync(TAGS_FILE, "utf8");
  const matches = [...source.matchAll(/\{\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"\s*\}/g)];
  if (matches.length === 0) {
    throw new Error(`Could not read any tags from ${TAGS_FILE}.`);
  }
  return matches.map(([, name, slug]) => ({ name, slug }));
}

/** "Understanding Attention" → "understanding-attention"; non-ASCII → "". */
export function slugify(title) {
  if (/[^\x00-\x7F]/.test(title)) return "";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Lowercase ASCII kebab-case only. Blocks traversal, spaces, capitals, CJK. */
export function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/** Directory that holds one content bundle, e.g. writing/zh/my-post. */
export function contentDir(collection, locale, slug) {
  return join(CONTENT_DIR, collection, locale, slug);
}

export function contentFile(collection, locale, slug) {
  return join(contentDir(collection, locale, slug), "index.md");
}

/**
 * Every content entry on disk: both `slug/index.md` bundles and flat
 * `slug.md` files. Duplicates are returned too, so validation can flag them.
 */
export function listContent() {
  const entries = [];
  for (const collection of COLLECTIONS) {
    for (const locale of LOCALES) {
      const localeDir = join(CONTENT_DIR, collection, locale);
      if (!existsSync(localeDir)) continue;
      for (const name of readdirSync(localeDir)) {
        const full = join(localeDir, name);
        if (statSync(full).isDirectory()) {
          for (const file of ["index.md", "index.mdx"]) {
            const candidate = join(full, file);
            if (existsSync(candidate)) entries.push({ collection, locale, slug: name, file: candidate });
          }
        } else if (/\.mdx?$/.test(name)) {
          entries.push({ collection, locale, slug: name.replace(/\.mdx?$/, ""), file: full });
        }
      }
    }
  }
  return entries;
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

/**
 * Minimal frontmatter reader for the subset MiniBlog uses: scalar strings,
 * booleans, ISO dates, inline arrays and block lists. Returns `{ data, body }`.
 */
export function parseFrontmatter(raw) {
  const source = raw.replace(/^\uFEFF/, "");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: source };

  const body = source.slice(match[0].length);
  const lines = match[1].split(/\r?\n/);
  const data = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) continue;
    if (/^\s*-\s+/.test(line)) continue; // list items are consumed by their key

    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    const rest = kv[2].trim();

    if (rest === "") {
      const items = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s+/.test(lines[j])) {
        items.push(unquote(lines[j].replace(/^\s*-\s+/, "").trim()));
        j++;
      }
      data[key] = items.length > 0 ? items : "";
      i = j - 1;
    } else if (rest === "true") {
      data[key] = true;
    } else if (rest === "false") {
      data[key] = false;
    } else if (rest === "[]") {
      data[key] = [];
    } else if (rest.startsWith("[") && rest.endsWith("]")) {
      data[key] = rest
        .slice(1, -1)
        .split(",")
        .map((item) => unquote(item.trim()))
        .filter(Boolean);
    } else {
      data[key] = unquote(rest);
    }
  }

  return { data, body };
}

/** Local date as YYYY-MM-DD, no date library. */
export function today() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Renders a frontmatter list, inline when empty, block otherwise. */
export function formatTags(tags) {
  return tags.length > 0 ? `tags:\n${tags.map((tag) => `  - ${tag}`).join("\n")}` : "tags: []";
}

export function relativeFromRoot(file) {
  return file.slice(ROOT.length + 1).replaceAll("\\", "/");
}

/**
 * A tiny line-oriented prompt helper.
 *
 * Reads through a queue rather than `readline.question`, so the prompts work
 * on a real terminal and with piped input alike. `confirm` defaults to the
 * safe answer and only accepts an explicit y/n.
 */
export function createPrompter() {
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

  async function confirm(question, defaultValue = true) {
    const suffix = defaultValue ? " [Y/n] " : " [y/N] ";
    for (;;) {
      const answer = (await ask(question + suffix)).toLowerCase();
      if (answer === "") return defaultValue;
      if (answer === "y" || answer === "yes") return true;
      if (answer === "n" || answer === "no") return false;
      stdout.write("Please answer y or n.\n");
    }
  }

  return { ask, confirm, close: () => rl.close() };
}

