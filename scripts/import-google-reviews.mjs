#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);

function getArg(flag, defaultValue = null) {
  const inline = args.find((arg) => arg.startsWith(`${flag}=`));
  if (inline) {
    return inline.slice(flag.length + 1);
  }
  const idx = args.indexOf(flag);
  if (idx === -1) return defaultValue;
  return args[idx + 1] ?? defaultValue;
}

function hasFlag(flag) {
  return args.includes(flag);
}

function printUsage() {
  console.log(`
Usage:
  node scripts/import-google-reviews.mjs --input <reviews.json> [options]

Options:
  --output <dir>       Output directory (default: src/content/testimonials)
  --reviewsKey <key>   Key containing reviews array when input is an object
  --ratingField <key>  Rating field name (default: rating)
  --nameField <key>    Reviewer name field name (default: name)
  --textField <key>    Review text field name (default: text)
  --dry-run            Show what would be written without writing files

Supported input:
  - Array of reviews
  - Object containing reviews under a key (try --reviewsKey if auto-detect misses)
`);
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function yamlEscape(text) {
  return String(text).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, " ");
}

function parseRating(raw) {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const match = raw.match(/\d+(\.\d+)?/);
    if (match) return Number(match[0]);
  }
  return NaN;
}

function pickFirst(obj, keys) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] != null) {
      return obj[key];
    }
  }
  return undefined;
}

function resolveReviews(payload, reviewsKey) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  if (reviewsKey && Array.isArray(payload[reviewsKey])) {
    return payload[reviewsKey];
  }

  const commonKeys = ["reviews", "googleReviews", "data", "items"];
  for (const key of commonKeys) {
    if (Array.isArray(payload[key])) return payload[key];
  }

  return [];
}

async function main() {
  if (hasFlag("--help") || hasFlag("-h")) {
    printUsage();
    return;
  }

  const positionalArgs = args.filter((arg) => !arg.startsWith("-"));
  const inputPath = getArg("--input", positionalArgs[0] ?? null);
  if (!inputPath) {
    console.error("Missing required argument: --input <reviews.json>");
    printUsage();
    process.exit(1);
  }

  const outputDir = getArg("--output", "src/content/testimonials");
  const reviewsKey = getArg("--reviewsKey");
  const ratingField = getArg("--ratingField", "rating");
  const nameField = getArg("--nameField", "name");
  const textField = getArg("--textField", "text");
  const dryRun = hasFlag("--dry-run");

  const raw = await fs.readFile(inputPath, "utf8");
  const parsed = JSON.parse(raw.replace(/^\uFEFF/, ""));
  const reviews = resolveReviews(parsed, reviewsKey);

  if (!reviews.length) {
    console.error("No reviews found. Try --reviewsKey <key> if your JSON wraps the array.");
    process.exit(1);
  }

  await fs.mkdir(outputDir, { recursive: true });

  let written = 0;
  let skipped = 0;

  for (const [index, review] of reviews.entries()) {
    if (!review || typeof review !== "object") {
      skipped += 1;
      continue;
    }

    const ratingRaw = pickFirst(review, [ratingField, "stars", "reviewRating", "ratingValue"]);
    const rating = parseRating(ratingRaw);
    if (rating !== 5) {
      skipped += 1;
      continue;
    }

    const nameRaw = pickFirst(review, [nameField, "reviewerName", "author_name", "authorName", "user", "reviewer"]);
    const textRaw = pickFirst(review, [textField, "review_text", "text", "comment", "content"]);

    const name = String(nameRaw ?? `Reviewer ${index + 1}`).trim();
    const testimonial = String(textRaw ?? "").trim();

    if (!testimonial) {
      skipped += 1;
      continue;
    }

    const baseSlug = slugify(name) || `review-${index + 1}`;
    let filename = `${baseSlug}.md`;
    let counter = 2;
    while (true) {
      try {
        await fs.access(path.join(outputDir, filename));
        filename = `${baseSlug}-${counter}.md`;
        counter += 1;
      } catch {
        break;
      }
    }

    const md = `---
rating: 5
name: "${yamlEscape(name)}"
testimonial: "${yamlEscape(testimonial)}"
---
`;

    const outPath = path.join(outputDir, filename);
    if (dryRun) {
      console.log(`[dry-run] ${outPath}`);
    } else {
      await fs.writeFile(outPath, md, "utf8");
      console.log(`Wrote ${outPath}`);
    }
    written += 1;
  }

  console.log(`Done. 5-star reviews written: ${written}. Skipped: ${skipped}.`);
}

main().catch((error) => {
  console.error("Import failed:", error.message);
  process.exit(1);
});
