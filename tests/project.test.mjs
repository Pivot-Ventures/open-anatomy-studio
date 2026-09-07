import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const organIds = [
  "heart",
  "vasculature",
  "arteries",
  "veins",
  "brain",
  "spinal_cord",
  "eye",
  "lungs",
  "nose",
  "larynx",
  "trachea",
  "bronchi",
  "diaphragm",
  "mouth",
  "oesophagus",
  "stomach",
  "liver",
  "gallbladder",
  "pancreas",
  "endocrine",
  "small_intestine",
  "intestine",
  "spleen",
  "thymus",
  "lymph_node",
  "tonsil",
  "urinary_system",
  "kidney",
  "ureter",
  "bladder",
  "prostate",
  "testis",
  "muscles",
  "skeleton",
  "pelvis",
  "knee",
  "intervertebral_disk",
  "skin",
];
const gltfModelIds = organIds.filter((id) => id !== "skin");

const read = (rel) => readFile(new URL(rel, root), "utf8");
const cjk = /[　-〿㐀-䶿一-鿿豈-﫿＀-￯]/;

test("ships the complete attributed model set", async () => {
  await access(new URL("THIRD_PARTY_ASSETS.md", root));

  const sizes = await Promise.all(
    gltfModelIds.map(async (id) => {
      const info = await stat(new URL(`public/models/${id}.glb`, root));
      return info.size;
    }),
  );

  assert.equal(sizes.length, 37);
  assert.ok(sizes.every((size) => size > 8_000), "every model should contain GLB data");
  assert.ok(sizes.every((size) => size < 2 * 1024 * 1024), "each model should stay under 2 MiB so school connections can load it");
  await assert.rejects(access(new URL("public/models/skin.glb", root)));

  const files = (await readdir(new URL("public/models/", root))).filter((file) => file.endsWith(".glb"));
  assert.equal(files.length, gltfModelIds.length, "no stray model files should ship");
});

test("every organ has a model path that resolves relative to the page", async () => {
  const data = await read("app/lib/anatomy.ts");
  for (const id of organIds) assert.match(data, new RegExp(`id: "${id}"`));
  assert.match(data, /modelKind: "skin-patch"/);
  assert.match(data, /const hra = \(file: string\) => `models\/\$\{file\}\.glb`/);
  assert.doesNotMatch(data, /"\/models\//, "model paths must not be root-relative");
});

test("is English only with no bilingual scaffolding", async () => {
  const sources = await Promise.all([
    read("app/lib/anatomy.ts"),
    read("app/lib/copy.ts"),
    read("app/lib/learning.ts"),
    read("app/lib/structures.ts"),
    read("app/components/AnatomyStudio.tsx"),
    read("app/components/AnatomyViewer.tsx"),
    read("app/layout.tsx"),
    read("app/page.tsx"),
    read("app/globals.css"),
    read("README.md"),
  ]);
  for (const source of sources) assert.doesNotMatch(source, cjk, "no Chinese, Japanese, or Korean characters may remain");
  const [data, copy, , , studio, , layout] = sources;
  assert.doesNotMatch(data, /LocalizedText|\bzh\b/);
  assert.doesNotMatch(copy, /\bzh\b|Language/);
  assert.doesNotMatch(studio, /setLang|lang ===/);
  assert.match(layout, /<html lang="en"/);
  assert.match(copy, /brandName: "Organ Studio"/);
  assert.doesNotMatch(`${data}\n${copy}`, /[—–]/, "visible copy should avoid em and en dashes");
});

test("every organ carries descriptive terms, labels, facts, functions, and a quiz", async () => {
  const catalogue = await import("../app/lib/anatomy.ts").catch(() => null);
  if (!catalogue) {
    // Node cannot import TypeScript without a loader; fall back to a structural check.
    const data = await read("app/lib/anatomy.ts");
    const blocks = data.split(/\n  \{\n    id: "/).slice(1);
    assert.equal(blocks.length, organIds.length);
    for (const block of blocks) {
      assert.match(block, /terms: \[/);
      assert.match(block, /hotspots: \[/);
      assert.match(block, /facts: \[/);
      assert.match(block, /functions: \[/);
      assert.match(block, /quiz: \{/);
      assert.match(block, /tissue: "/);
      assert.ok((block.match(/\{ term: "/g) ?? []).length >= 4, "at least four descriptive terms per organ");
      assert.ok((block.match(/\{ id: "[a-z0-9-]+", name: "/g) ?? []).length >= 2, "at least two labels per organ");
    }
    return;
  }
  for (const organ of catalogue.organs) {
    assert.ok(organ.terms.length >= 4);
    assert.ok(organ.hotspots.length >= 2);
    assert.ok(organ.facts.length >= 3);
    assert.ok(organ.functions.length >= 3);
    assert.equal(organ.quiz.options.length, 4);
  }
});

test("ships a source-aware learning contract with several guided lessons", async () => {
  const [learning, anatomy, studio] = await Promise.all([
    read("app/lib/learning.ts"),
    read("app/lib/anatomy.ts"),
    read("app/components/AnatomyStudio.tsx"),
  ]);

  for (const contract of ["LearningDiscipline", "LearningTopic", "LearningLesson", "LearningScene", "LearningActivity", "LearningAssessment"]) {
    assert.match(learning, new RegExp(`type ${contract}`));
  }

  assert.match(learning, /id: "heart-blood-flow-basics"/);
  assert.match(learning, /id: "kidney-filtration-basics"/);
  assert.match(learning, /id: "lungs-airway-tree"/);
  assert.match(learning, /kind: "locate"/);
  assert.match(learning, /kind: "section"/);
  assert.match(learning, /kind: "explode"/);
  assert.match(learning, /kind: "quiz"/);
  assert.match(learning, /export const lessonByOrganId/);
  assert.match(anatomy, /sourceIds: \["openstax"\]/);
  assert.match(anatomy, /reviewStatus: "draft"/);
  assert.match(studio, /className="guided-lesson"/);
  assert.match(studio, /role="progressbar"/);
});

test("viewer exposes the enhanced functions", async () => {
  const [viewer, studio, structures] = await Promise.all([
    read("app/components/AnatomyViewer.tsx"),
    read("app/components/AnatomyStudio.tsx"),
    read("app/lib/structures.ts"),
  ]);
  assert.match(viewer, /tissuePresets/);
  assert.match(viewer, /onBeforeCompile/);
  assert.match(viewer, /explodeDirection/);
  assert.match(viewer, /hiddenStructures/);
  assert.match(viewer, /createPortal/);
  assert.match(viewer, /resolveModelUrl/);
  assert.match(viewer, /computeVertexNormals/);
  assert.match(viewer, /sectionPlaneFor/);
  assert.match(viewer, /toDataURL\("image\/png"\)/);
  assert.match(studio, /materialMode/);
  assert.match(studio, /requestFullscreen/);
  assert.match(studio, /className="structure-list"/);
  assert.match(studio, /className="terms-section"/);
  assert.match(structures, /export function describeStructure/);
  assert.match(structures, /left ventricle/);
  assert.match(structures, /renal pyramid/);
});

test("keeps responsive and fallback repair contracts in place", async () => {
  const [css, studio, viewer] = await Promise.all([
    read("app/globals.css"),
    read("app/components/AnatomyStudio.tsx"),
    read("app/components/AnatomyViewer.tsx"),
  ]);

  assert.match(css, /\.viewer-panel\s*\{[^}]*height:\s*calc\(100svh - var\(--header-height\) - 28px\)/s);
  assert.match(css, /\.library-panel\s*\{[^}]*width:\s*100%[^}]*max-width:\s*100%[^}]*overflow:\s*hidden/s);
  assert.match(css, /\.mobile-nav\s*\{[^}]*position:\s*fixed/s);
  assert.match(studio, /aria-label=\{ui\.sources\}/);
  assert.match(studio, /aria-label=\{ui\.mobileNavigation\}/);
  assert.match(viewer, /canCreateWebGLContext/);
  assert.match(viewer, /dpr=\{\[1, 1\.5\]\}/);
  assert.match(viewer, /resolution=\{256\}/);
});

test("static export config and EASI build script exist", async () => {
  const [config, pkg, script] = await Promise.all([
    read("next.config.ts"),
    read("package.json"),
    read("scripts/build-easi.mjs"),
  ]);
  assert.match(config, /output: "export"/);
  assert.match(config, /trailingSlash: true/);
  assert.match(pkg, /"build:easi"/);
  assert.match(script, /\/atlas\/organs/);
});
