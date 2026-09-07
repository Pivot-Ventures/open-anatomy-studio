# Human Atlas Organ Studio

A source-aware 3D organ explorer for the EASI Human Atlas desk. It ships 26 Human Reference Atlas organ models, 11 BodyParts3D whole-body models (stomach, oesophagus, skeleton, muscles, arteries, veins, and more), plus a procedural skin cross section, names every structure inside each model, and pairs the 3D stage with descriptive terms, facts, guided lessons, and quizzes. English only.

Live: https://easi.pivotventures.tech/atlas/organs/ (the **Organs** tab of the Human Atlas desk in the EASI academics portal).

## What it does

- **38 organs across 12 systems**: heart, trunk vessels, the whole-body arterial and venous systems; brain and spinal cord; eye; nose, lungs, larynx, trachea, main bronchi, and diaphragm; mouth with tongue, teeth, and salivary glands; oesophagus and pharynx, stomach, liver, gallbladder, pancreas, small and large intestine; endocrine glands (pituitary, pineal, adrenals); spleen, thymus, lymph node, and palatine tonsil; the urinary system, kidney, renal pelvis and ureter, and bladder; prostate and seminal glands, testes and ducts; the muscular system, the full 206-bone skeleton, bony pelvis, knee joint, and intervertebral discs; skin.
- **Every structure is selectable.** The models keep all of their named parts (for example 283 regions of the brain and 106 vessels), and clicking any part shows its anatomical name and a plain-English meaning from the structure glossary in `app/lib/structures.ts`.
- **Realistic tissue rendering.** A physically based material per tissue type (muscle, neural, lung, liver, gland, mucosa, kidney, artery, vein, bone, cartilage, eye, lymphoid) with wet clearcoat, soft sheen, and procedural surface detail computed in a shader. A one-click switch shows the colour-coded scheme instead, which is easier for telling structures apart.
- **Labels anchored to geometry.** Each organ has numbered labels attached to real structures so they follow the model when it is exploded.
- **Explode, section, layers.** Pull the parts of a model apart with a slider, cut it open along any axis, and hide, show, or isolate any structure group from the layer list.
- **Descriptive terms.** Every organ carries a glossary of the words a learner needs (atrium, ventricle, alveolus, nephron, meniscus, and so on).
- **Guided lessons** for the heart, kidney, and lungs that check locate, section, explode, and quiz steps as the learner completes them, plus a quick quiz on every organ.
- **Snapshot and full screen.** Save a PNG of the current view or take the stage full screen.
- Search, system filters, favourites, local progress, light and dark themes, reduced-motion support, keyboard shortcuts, mobile layout, and a text fallback when WebGL is unavailable.
- In-product sources, attribution, code licence, and an educational disclaimer.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Quality checks:

```bash
npm run check
```

That runs the typecheck, lint, tests, and the repository boundary check.

## Building for EASI

The studio is exported as static HTML (`output: "export"`). On the EASI droplet Caddy serves it from `/opt/basi/human-atlas-static/organs` at `/atlas/organs/`, so the exported asset links must carry that prefix. Model files load relative to the page URL and need no rewrite.

```bash
npm run build:easi     # vinext build + rewrite links to /atlas/organs/
npm run deploy:easi    # rsync dist/client to the droplet and verify through Caddy
```

`deploy:easi` defaults to `root@204.48.26.134` with `~/.ssh/basi_do`; pass a different `user@host` and key as arguments. It refuses to sync a build that has not been rewritten for `/atlas/organs/`.

To host at a different path, run `node scripts/build-easi.mjs --base /some/path`. To host at the site root, `npm run build` is enough.

## Adding or updating a model

1. Download the male reference object from the Human Reference Atlas API (`https://apps.humanatlas.io/api/v1/reference-organs`).
2. Slim it while keeping every named node:

   ```bash
   npm i -D @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer
   node scripts/slim-model.mjs source.glb public/models/<id>.glb 0.3
   ```

   The third argument is the triangle ratio to keep (1 keeps everything). Aim for files under 1 MB.
3. Add the organ to `app/lib/anatomy.ts` with its labels anchored to mesh names from the file (`mesh: "VH_M_..."`), add glossary rules to `app/lib/structures.ts` for any new structure names, and record the file in `THIRD_PARTY_ASSETS.md`.

## Architecture

- Next.js 16 App Router on vinext and Vite, React 19, TypeScript, static export
- Three.js, React Three Fiber, Drei
- `app/lib/anatomy.ts`: organ catalogue (facts, functions, descriptive terms, labels, quizzes)
- `app/lib/structures.ts`: mesh-name glossary and label formatting for the HRA models
- `app/lib/learning.ts`: discipline-agnostic lesson, activity, and assessment contract with three guided lessons
- `app/components/AnatomyViewer.tsx`: the 3D stage, tissue materials and shader, explode, section, layers, labels, snapshot
- `app/components/AnatomyStudio.tsx`: the learning workspace around the stage
- Local-only settings, favourites, and progress

## Licences

Source code is MIT licensed. 26 of the binary 3D models are Human Reference Atlas data and 11 are BodyParts3D data, all under CC BY 4.0; see [THIRD_PARTY_ASSETS.md](THIRD_PARTY_ASSETS.md) for provenance, the modification disclosure, and checksums. The skin cross section is generated by project code.

This application is for anatomy learning only and is not medical advice.
