#!/usr/bin/env node
/**
 * Publish content: verify, then commit and push only `src/content/**`.
 *
 * This is an author tool, not a deployment tool. It refuses to run unless the
 * working tree contains content changes and nothing else, never stages
 * developer files, never force-pushes, and never publishes a draft without an
 * explicit confirmation. It reuses `npm run verify` rather than reimplementing
 * any checks.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import {
  ROOT,
  createPrompter,
  listContent,
  parseFrontmatter,
} from "./content-utils.mjs";

const CONTENT_PREFIX = "src/content/";
const prompter = createPrompter();

class Cancelled extends Error {}
const cancel = (message) => {
  throw new Cancelled(message);
};

/** Run git and return stdout, or null when the command is allowed to fail. */
function git(args, { allowFail = false } = {}) {
  const result = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
  if (result.status !== 0) {
    if (allowFail) return null;
    throw new Error((result.stderr || result.stdout || `git ${args.join(" ")} failed`).trim());
  }
  return result.stdout;
}

const gitLines = (args) => git(args).split("\n").map((line) => line.trim()).filter(Boolean);

/** "src/content/writing/zh/my-post/cover.webp" → the writing/zh/my-post unit. */
function unitFromPath(file) {
  const rel = file.replaceAll("\\", "/");
  if (!rel.startsWith(CONTENT_PREFIX)) return null;
  const parts = rel.slice(CONTENT_PREFIX.length).split("/");
  if (parts.length < 3) return null;
  const [collection, locale] = parts;
  const slug = parts[2].replace(/\.mdx?$/, "");
  return { collection, locale, slug, key: `${collection}/${locale}/${slug}` };
}

function setDraftFalse(file) {
  if (!file || !existsSync(file)) return;
  const raw = readFileSync(file, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match || !/^draft:\s*true\s*$/m.test(match[1])) return;
  const block = match[1].replace(/^draft:\s*true\s*$/m, "draft: false");
  const updated = raw.slice(0, match.index) + match[0].replace(match[1], block) + raw.slice(match.index + match[0].length);
  writeFileSync(file, updated, "utf8");
}

function commitMessage(items) {
  if (items.length === 1) {
    const item = items[0];
    return item.collection === "writing" ? `Publish: ${item.title}` : `Publish project: ${item.title}`;
  }
  return `Content: update ${items.length} items`;
}

async function main() {
  console.log("MiniBlog · publish\n");

  if (git(["rev-parse", "--is-inside-work-tree"], { allowFail: true }) === null) {
    cancel("Publish cancelled: not inside a Git repository.");
  }

  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]).trim();
  if (branch !== "main") {
    cancel(`Publish cancelled.\nMiniBlog content publishing is only allowed from main.\nCurrent branch: ${branch}`);
  }

  const staged = gitLines(["diff", "--cached", "--name-only", "--no-renames"]);
  if (staged.length > 0) {
    cancel(`Publish cancelled.\n\nSome files are already staged.\nPlease commit or unstage them before using npm run publish.\n\n${staged.map((file) => `  ${file}`).join("\n")}`);
  }

  const changed = [...new Set([
    ...gitLines(["diff", "--name-only", "--no-renames"]),
    ...gitLines(["ls-files", "--others", "--exclude-standard"]),
  ])];
  if (changed.length === 0) {
    console.log("Nothing to publish.");
    return;
  }

  const nonContent = changed.filter((file) => !file.replaceAll("\\", "/").startsWith(CONTENT_PREFIX));
  if (nonContent.length > 0) {
    cancel(`Publish cancelled.\n\nNon-content changes were detected:\n\n${nonContent.map((file) => `  ${file}`).join("\n")}\n\nnpm run publish is intentionally content-only.\nCommit developer changes separately, then run npm run publish again.`);
  }

  const filesByUnit = new Map();
  for (const entry of listContent()) {
    filesByUnit.set(`${entry.collection}/${entry.locale}/${entry.slug}`, entry.file);
  }

  const units = new Map();
  for (const file of changed) {
    const unit = unitFromPath(file);
    if (unit) units.set(unit.key, unit);
  }

  const items = [...units.values()].map((unit) => {
    const file = filesByUnit.get(unit.key);
    let title = unit.slug;
    let draft = false;
    if (file && existsSync(file)) {
      const { data } = parseFrontmatter(readFileSync(file, "utf8"));
      if (typeof data.title === "string" && data.title.trim()) title = data.title.trim();
      draft = data.draft === true;
    }
    return { ...unit, file, title, draft };
  });

  const drafts = items.filter((item) => item.draft);
  if (drafts.length === 1) {
    const item = drafts[0];
    console.log(`Draft detected:\n\n  "${item.title}"\n  ${item.collection} / ${item.locale} / ${item.slug}\n`);
    const confirmed = await prompter.confirm("Publish this draft now?\nThis will change `draft: true` to `draft: false`.", true);
    if (!confirmed) cancel("Publish cancelled.\nThe content remains a draft.");
    for (const draft of drafts) setDraftFalse(draft.file);
  } else if (drafts.length > 1) {
    console.log(`${drafts.length} drafts are included in this publish:\n`);
    drafts.forEach((draft, index) => console.log(`  ${index + 1}. ${draft.title}`));
    const confirmed = await prompter.confirm(`\nPublish all ${drafts.length} drafts?`, false);
    if (!confirmed) cancel("Publish cancelled.\nThe content remains a draft.");
    for (const draft of drafts) setDraftFalse(draft.file);
  }

  console.log(`\nReady to publish${items.length > 1 ? ` ${items.length} content items` : ""}:\n`);
  for (const item of items) {
    const kind = item.collection === "writing" ? "Writing" : "Project";
    console.log(`  ${kind} · ${item.title}`);
    console.log(`  ${item.locale} · ${item.slug}`);
  }
  console.log(`\nFiles changed (${changed.length}):`);
  for (const file of changed) console.log(`  ${file}`);

  console.log("\nVerifying...\n");
  const verify = spawnSync("npm", ["run", "verify"], { cwd: ROOT, stdio: "inherit", shell: true });
  if (verify.status !== 0) {
    cancel("Publish stopped.\n\nVerification failed.\nNothing was committed or pushed.\n\nFix the errors above and run:\n\n  npm run publish");
  }

  const confirmed = await prompter.confirm("\nVerification passed.\n\nPublish to GitHub?", items.length === 1);
  if (!confirmed) cancel("Publish cancelled.\nNothing was committed or pushed.");

  git(["add", "-A", "--", "src/content"]);
  git(["commit", "-m", commitMessage(items)]);
  console.log("\nCommitted locally.");

  const push = spawnSync("git", ["push", "origin", "main"], { cwd: ROOT, stdio: "inherit" });
  if (push.status !== 0) {
    cancel("Local commit created successfully, but push failed.\n\nYour work is safe locally.\n\nResolve the Git issue and run:\n\n  git push origin main");
  }

  console.log("\nPublished to GitHub.\n");
  console.log("GitHub Actions will verify and deploy the site.\n");
  console.log("MiniBlog · done");
}

process.on("SIGINT", () => {
  console.log("\nCancelled.");
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
