# Third-party assets

The source code of Open Anatomy Studio is a clean-room implementation. The binary 3D models under `public/models/` are third-party data and are not covered by the repository's MIT code license.

## Human Reference Atlas 3D models

- Upstream project: [Human Reference Atlas 3D Reference Object Library](https://humanatlas.io/3d-reference-library)
- Data publisher: Human BioMolecular Atlas Program (HuBMAP)
- License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- Source release: Visible Human Male reference objects, release v1.2
- Files used: brain, eye, gallbladder, heart, large intestine, kidney, liver, lungs, pancreas, ileum, spleen, and left thymic lobe
- Scope disclosure: the intermediary filenames `small_intestine.glb` and `thymus.glb` contain the semantic meshes `VH_M_ileum` and `VH_M_thymus_lobe_L`. The application identifies these as the ileum and the left thymic lobe instead of presenting them as complete small intestine and complete thymus geometry.
- Local modifications: the redistributed files were compressed with Meshopt by the `tejasghalsasi/anatomy-atelier` project using `@gltf-transform/cli`. Open Anatomy Studio renamed files for stable application routes and made no anatomical geometry edits.
- Intermediary source commit: [`1da776126a81dd803fd12d22e6723522db3bb3b5`](https://github.com/tejasghalsasi/anatomy-atelier/tree/1da776126a81dd803fd12d22e6723522db3bb3b5/public/models)
- Added model checksums:
  - `gallbladder.glb`: `0d3fa98673dc6c204f188a427dbdf33052f590a791dcde43434903ebdddc9da3`
  - `small_intestine.glb`: `2a96d7d56436f0872b08e183383f63d807057c9c3c0a6b38f4c5c95700e094df`
  - `thymus.glb`: `5b3558757847d135ab49352960d694fcb8e47bff0ff2ae12da72f8778166d448`
- Retrieval date: 2026-08-04

Suggested citation for the v1.2 release:

> Schlehlein, Heidi, Bruce W. Herr II, Ellen M. Quardokus, Andreas Bueckle, and Katy Börner. 2022. HuBMAP CCF 3D Reference Object Library. Accessed May 6, 2022.

Attribution displayed inside the application:

> HRA 3D organ models © Human Reference Atlas (CC BY 4.0), HuBMAP.

The intermediary repository is referenced only to disclose the optimization step. No source code from that repository is included.

## Local procedural skin cross section

The skin view is generated at runtime from project-owned Three.js geometry and materials. It presents a local educational cross section with epidermis, dermis, subcutaneous tissue, a hair follicle, a sweat gland, and simplified dermal vessels. It does not use a scanned body, whole-person geometry, genital anatomy, or an external binary model.
