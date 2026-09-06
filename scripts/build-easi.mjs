#!/usr/bin/env node
/**
 * Build the studio for the EASI droplet, where Caddy serves it from
 * /opt/basi/human-atlas-static/organs at https://easi.pivotventures.tech/atlas/organs/.
 *
 * vinext's static export prerenders "/" with root-relative asset links. Caddy
 * strips the /atlas prefix (handle_path), so a link to /assets/x.js would fall
 * through to the body atlas and 404. This script runs the export and rewrites
 * those links to /atlas/organs/... in every HTML, RSC, CSS, and header file.
 * Chunk imports are relative and model URLs resolve from the page, but the
 * module-preload dependency list embedded in the JavaScript holds bare
 * "assets/chunk.js" entries that Vite joins with the site root, so those are
 * rewritten to carry the mount path as well.
 *
 * Usage: node scripts/build-easi.mjs [--base /atlas/organs] [--skip-build]
 */
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const baseIndex = args.indexOf("--base");
const base = (baseIndex >= 0 ? args[baseIndex + 1] : "/atlas/organs").replace(/\/$/, "");
const skipBuild = args.includes("--skip-build");
const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist", "client");

if (!skipBuild) {
  execSync("npm run build", { cwd: root, stdio: "inherit" });
}

if (!existsSync(join(dist, "index.html"))) {
  console.error("dist/client/index.html is missing. The static export did not prerender the home route.");
  process.exit(1);
}

const rewriteExtensions = new Set([".html", ".rsc", ".css", ".txt", ".json", ".js"]);
const rewritten = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    const ext = entry.slice(entry.lastIndexOf("."));
    if (!rewriteExtensions.has(ext) && entry !== "_headers") continue;
    const before = readFileSync(path, "utf8");
    let after = before
      .replace(/(["'(=])\/(assets|models|favicon\.svg|og\.png)/g, `$1${base}/$2`)
      .replace(/^\/assets\//gm, `${base}/assets/`);
    if (ext === ".js") {
      // Vite's module-preload helper joins the site root ("/") with the bare
      // "assets/chunk.js" entries of __vite__mapDeps, so give those entries
      // the mount path without a leading slash.
      after = after.replace(/"assets\//g, `"${base.replace(/^\//, "")}/assets/`);
    }
    if (after !== before) {
      writeFileSync(path, after);
      rewritten.push(path.slice(dist.length + 1));
    }
  }
}

walk(dist);

const index = readFileSync(join(dist, "index.html"), "utf8");
if (!index.includes(`${base}/assets/`)) {
  console.error(`index.html still lacks ${base}/assets/ links after the rewrite.`);
  process.exit(1);
}
if (/[　-鿿]/.test(index)) {
  console.error("index.html contains CJK text; the English-only build is incomplete.");
  process.exit(1);
}

const models = readdirSync(join(dist, "models")).filter((file) => file.endsWith(".glb"));
console.log(`EASI build ready at dist/client (base ${base}/): ${rewritten.length} files rewritten, ${models.length} models.`);
