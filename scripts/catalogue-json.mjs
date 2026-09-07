#!/usr/bin/env node
/**
 * Print the organ catalogue as JSON for tooling that cannot import TypeScript,
 * such as the EASI deploy workflow's image pre-warm step. Reads
 * app/lib/anatomy.ts and extracts id, name, latin, system, summary, and the
 * descriptive terms of every organ entry.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const source = readFileSync(new URL("../app/lib/anatomy.ts", import.meta.url), "utf8");
const field = (block, key) => {
  const match = block.match(new RegExp(`\\n    ${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "s"));
  return match ? match[1].replace(/\\"/g, '"') : "";
};

export function catalogue(text = source) {
  return text
    .split('\n  {\n    id: "')
    .slice(1)
    .map((block) => ({
      organId: block.slice(0, block.indexOf('"')),
      name: field(block, "name"),
      latin: field(block, "latin"),
      system: field(block, "system").replace(/^\w/, (c) => c.toUpperCase()),
      summary: field(block, "summary"),
      terms: [...block.matchAll(/\{ term: "([^"]+)"/g)].map((m) => m[1]).slice(0, 8),
    }))
    .filter((organ) => organ.summary);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.stdout.write(JSON.stringify(catalogue(), null, 1));
}
