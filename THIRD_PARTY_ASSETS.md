# Third-party assets

The source code of the Human Atlas Organ Studio is a clean-room implementation. The binary 3D models under `public/models/` are third-party data and are not covered by the repository's MIT code licence.

## Human Reference Atlas 3D models

- Upstream project: [Human Reference Atlas 3D Reference Object Library](https://humanatlas.io/3d-reference-library)
- Data publisher: Human BioMolecular Atlas Program (HuBMAP)
- Licence: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- Source: Visible Human Male reference objects downloaded from `https://cdn.humanatlas.io/digital-objects/ref-organ/<organ>/<version>/assets/` as listed by `https://apps.humanatlas.io/api/v1/reference-organs` on 2026-09-06. The brain is the Allen Human Brain Atlas reference object and the lymph node is the NIH (Yao) reference object distributed by the same library.
- Scope: left-sided objects are used where the library ships paired organs (eye, kidney, ureter, palatine tonsil, knee). The prostate object includes the seminal vesicle, vas deferens, and ejaculatory duct and no external anatomy. The full-body skin object is deliberately not used; the skin view is a local procedural cross section.
- Local modifications (`scripts/slim-model.mjs`, glTF Transform 4.5 and meshoptimizer): unused vertex attributes (tangents, texture coordinates, vertex colours, and the original normals) were removed, vertices welded, large meshes simplified to a target triangle ratio, positions quantised to 14 bits, and the result compressed with `EXT_meshopt_compression`. Every named node from the source file is preserved so each anatomical structure remains individually selectable. No geometry was added or reshaped. Smooth normals are recomputed by the viewer at load time.
- The gallbladder object is not published individually by the reference-organ API. The Meshopt-compressed `gallbladder.glb` from the `tejasghalsasi/anatomy-atelier` intermediary (commit `1da776126a81dd803fd12d22e6723522db3bb3b5`, retrieved 2026-08-04) is retained unchanged.

| File | HRA object | Version | Size | SHA-256 (prefix) |
|------|------------|---------|------|------------------|
| `heart.glb` | heart (VH_M_heart) | v1.3 | 304 KB | `2c0af4b22884db81…` |
| `vasculature.glb` | blood vasculature (VH_M_blood_vasculature) | v1.3 | 506 KB | `42ad3512e49f34eb…` |
| `brain.glb` | brain (Allen_brain) | v1.4 | 843 KB | `ba6157fb256ee2da…` |
| `spinal_cord.glb` | spinal cord (VH_M_spinal_cord) | v1.1 | 103 KB | `e770bd7cc7cf2ccf…` |
| `eye.glb` | Left eye (VH_M_eye_L) | v1.3 | 139 KB | `8e42d4907b0a4305…` |
| `lungs.glb` | lung (VH_M_respiratory_system) | v1.4 | 406 KB | `897a285b15cf44f1…` |
| `larynx.glb` | larynx (VH_M_larynx) | v1.1 | 57 KB | `65666b215a2b45c4…` |
| `trachea.glb` | trachea (VH_M_trachea) | v1.1 | 92 KB | `73e00fe7af303469…` |
| `bronchi.glb` | main bronchus (VH_M_main_bronchi) | v1.1 | 28 KB | `734c844d19c7a56d…` |
| `mouth.glb` | mouth (VH_M_mouth) | v1.0 | 391 KB | `d10a8e36bd48bd96…` |
| `liver.glb` | liver (VH_M_liver) | v1.2 | 244 KB | `58bc15a3083327cc…` |
| `pancreas.glb` | pancreas (VH_M_pancreas) | v1.3 | 114 KB | `71aab69661d8fb99…` |
| `small_intestine.glb` | small intestine (VH_M_small_intestine) | v1.2 | 131 KB | `01eade891b7d86ee…` |
| `intestine.glb` | large intestine (VH_M_colon) | v1.3 | 137 KB | `341880c0ce693d9e…` |
| `spleen.glb` | spleen (VH_M_spleen) | v1.3 | 64 KB | `481b6cf5cc936374…` |
| `thymus.glb` | thymus (VH_M_thymus) | v1.3 | 12 KB | `af75b38dcef51aff…` |
| `lymph_node.glb` | lymph node (Yao_lymph_node) | v1.4 | 184 KB | `0bb97c7ec21d6e3c…` |
| `tonsil.glb` | Left palatine tonsil (VH_M_palatine_tonsil_L) | v1.2 | 59 KB | `c8776d97cef21e5b…` |
| `kidney.glb` | Left kidney (VH_M_left_kidney) | v1.3 | 209 KB | `8681bc3ee88ef074…` |
| `ureter.glb` | Left ureter (VH_M_ureter_L) | v1.2 | 108 KB | `66dcd2455f75b595…` |
| `bladder.glb` | urinary bladder (VH_M_urinary_bladder) | v1.2 | 45 KB | `f9155653ee7f86a7…` |
| `prostate.glb` | prostate (VH_M_male_reproductive_system) | v1.2 | 252 KB | `e151b59cf95f9c79…` |
| `pelvis.glb` | pelvis (VH_M_pelvis) | v1.3 | 183 KB | `3a69835eceb51bbc…` |
| `knee.glb` | Left knee (VH_M_knee_L) | v1.2 | 102 KB | `1e8b5ff931be9666…` |
| `intervertebral_disk.glb` | intervertebral disk (VH_M_intervertebral_disk) | v1.0 | 209 KB | `1cdc129e29cad017…` |
| `gallbladder.glb` | gallbladder (VH_M_gallbladder), via anatomy-atelier | v1.2 release | 11 KB | `0d3fa98673dc6c20…` |


Full SHA-256 checksums of the shipped files:

  - `heart.glb`: `2c0af4b22884db81934e0f9c9c692a6921386be5c1980f90ad816f2f062b5ac8`
  - `vasculature.glb`: `42ad3512e49f34eb23df296c82610ce7e5c7a82a6cbadd210e17a27a4cc74a5a`
  - `brain.glb`: `ba6157fb256ee2dae3e33178a06f130a4509a9e776ca38d028d6fb4b18ff01ee`
  - `spinal_cord.glb`: `e770bd7cc7cf2ccfa63bf24ca1c8730d81982522fa3ad6474aa75e01979bc70c`
  - `eye.glb`: `8e42d4907b0a430545a4949ebba9d9073816ae9a4383d14c76279e418f35f222`
  - `lungs.glb`: `897a285b15cf44f199ff2b866bffcbf481dc680ac9371f89addc9ae7abd43b91`
  - `larynx.glb`: `65666b215a2b45c4a9abcfad81a3783b3ee9d679b8f6a637e931c96cfb2e5818`
  - `trachea.glb`: `73e00fe7af303469183ff32ac6795d2b9ee38efd5ccc743029fd35ea6ef230df`
  - `bronchi.glb`: `734c844d19c7a56d0ebb5d3dc4f9608b99c71e862b0319d8025c5695f613a0e5`
  - `mouth.glb`: `d10a8e36bd48bd969cfcd02179d6ebc5e8201d7c1d0b4e9827fc30b8b1e41a52`
  - `liver.glb`: `58bc15a3083327cc9006f89226338273c42b83a6dd11186a1766e4a728eaa79e`
  - `pancreas.glb`: `71aab69661d8fb995e4ea98a28bfc6ded64d2e37a17887e61f37ed4f30ab2ba4`
  - `small_intestine.glb`: `01eade891b7d86eea461b4762269e79f3db4d2faf563bb1c5479eebb33813034`
  - `intestine.glb`: `341880c0ce693d9e8f232e5895f1341a04b9a5610b9fc14fd9081ecbbb7b7a75`
  - `spleen.glb`: `481b6cf5cc936374e7af10fa48d96a27fce1b18050a3d42ca3d2fc885149585a`
  - `thymus.glb`: `af75b38dcef51aff7a88e9496afd498f0ea8061c9fd2191d7973c0c37ee8ba45`
  - `lymph_node.glb`: `0bb97c7ec21d6e3c0ce84d6aa5f6c654da0e6cced0ba03b9c64f4ecbd4069378`
  - `tonsil.glb`: `c8776d97cef21e5be15465aece8662bd0967791366f140d81b4c10309cf0a5b0`
  - `kidney.glb`: `8681bc3ee88ef074007dfa3991eb2bedae2954282833f08dc6133e920de96fc5`
  - `ureter.glb`: `66dcd2455f75b5954077802a5dc9bc409ef189b4696e7183bf5686b663bbeb66`
  - `bladder.glb`: `f9155653ee7f86a7ff9d1b739369ab8000c5fbe5a12250796b97ed59f144dde7`
  - `prostate.glb`: `e151b59cf95f9c79e8f8b3024c48b0ca811f9abc2a340749356f7eceedacdb39`
  - `pelvis.glb`: `3a69835eceb51bbc149c915818a28058cebcead0db0832d7a188ed2dca0705a0`
  - `knee.glb`: `1e8b5ff931be9666077afc1ba8d29d3e6f47dfac843239e2244c21dffb77a498`
  - `intervertebral_disk.glb`: `1cdc129e29cad01783a6a5df7c5a176570cb572d621d463610c9d8eab4630265`
  - `gallbladder.glb`: `0d3fa98673dc6c204f188a427dbdf33052f590a791dcde43434903ebdddc9da3`
Suggested citation:

> Schlehlein, Heidi, Bruce W. Herr II, Ellen M. Quardokus, Andreas Bueckle, and Katy Börner. 2022. HuBMAP CCF 3D Reference Object Library. Accessed 2026-09-06.

Attribution displayed inside the application:

> HRA 3D organ models © Human Reference Atlas (CC BY 4.0), HuBMAP.

The intermediary repository is referenced only to disclose the origin of the gallbladder file. No source code from that repository is included.

## BodyParts3D models (stomach and skeleton)

- Upstream project: [BodyParts3D 4.0](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html), Database Center for Life Science (DBCLS)
- Licence: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) per the current database licence page (https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html); older OBJ comments mention CC BY-SA 2.1 Japan, which the current licence supersedes.
- Source: the Pivot-Ventures/human-atlas body tab's packed BodyParts3D chunks (`atlas.json` + `body-*.bin`, themselves simplified with a 0.2% error bound from `isa_BP3D_4.0_obj_99.zip`). The exporter (`export-bp3d.py` in the working notes) copies the selected named parts into a GLB without editing geometry, then `scripts/slim-model.mjs` welds, simplifies (skeleton only, ratio 0.6), quantises, and meshopt-compresses.
- `stomach.glb`: parts FJ2563 Esophagus, FJ2564 Stomach, FJ2573 Duodenum (3 nodes, 3,660 triangles).
- `skeleton.glb`: 206 bone parts selected by name (vertebrae including atlas and axis, ribs, sternum, skull bones, hyoid, girdles, limb bones, carpals, metacarpals, phalanges, tarsals, metatarsals, sesamoids); teeth, cartilage, and ligaments excluded.
- Node names carry a `BP3D_` prefix and the FMA concept id in `extras.fma`.
- Checksums:
  - `stomach.glb`: `07ad4e3b12dec4628a3da4ecebf4e433c4f3767e5d5e6ec8c310dee37697ca1b`
  - `skeleton.glb`: `ac487533d9b848c234cd9462d233578a9b741c87d9a5aacdc3828700bff6f22b`
- Citation: Mitsuhashi N. et al. (2009) BodyParts3D: 3D structure database for anatomical concepts. Nucleic Acids Research 37: D782–D785. https://doi.org/10.1093/nar/gkn613

Attribution displayed inside the application:

> Stomach and skeleton © BodyParts3D, DBCLS (CC BY 4.0).

## Local procedural skin cross section

The skin view is generated at runtime from project-owned Three.js geometry and materials. It presents a local educational cross section with epidermis, dermis, subcutaneous tissue, a hair follicle, a sweat gland, and simplified dermal vessels. It does not use a scanned body, whole-person geometry, or an external binary model.

## Text content

Organ summaries, facts, descriptive terms, structure glossary entries, and quizzes are original educational summaries written for this project with reference to OpenStax Anatomy and Physiology 2e (CC BY 4.0) and MedlinePlus. They are not medical advice.
