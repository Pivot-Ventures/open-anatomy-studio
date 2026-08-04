import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const modelIds = ["heart", "brain", "lungs", "liver", "kidney", "eye", "pancreas", "intestine", "spleen", "skin"];

test("ships the complete attributed model set", async () => {
  await access(new URL("THIRD_PARTY_ASSETS.md", root));

  const sizes = await Promise.all(
    modelIds.map(async (id) => {
      const info = await stat(new URL(`public/models/${id}.glb`, root));
      return info.size;
    }),
  );

  assert.equal(sizes.length, 10);
  assert.ok(sizes.every((size) => size > 8_000), "every model should contain GLB data");
  assert.ok(sizes.every((size) => size < 20 * 1024 * 1024), "each model should stay below the repository budget");
});

test("keeps bilingual content and product metadata in place", async () => {
  const [data, copy, page, layout] = await Promise.all([
    readFile(new URL("app/lib/anatomy.ts", root), "utf8"),
    readFile(new URL("app/lib/copy.ts", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
  ]);

  for (const id of modelIds) assert.match(data, new RegExp(`id: "${id}"`));
  assert.match(copy, /开放解剖工作室/);
  assert.match(copy, /Open Anatomy Studio/);
  assert.match(page, /codex-preview/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(`${data}\n${copy}`, /[—–]/, "visible copy should avoid em and en dashes");
});
