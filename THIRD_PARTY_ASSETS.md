# Third-party assets

The source code of Open Anatomy Studio is a clean-room implementation. The binary 3D models under `public/models/` are third-party data and are not covered by the repository's MIT code license.

## Human Reference Atlas 3D models

- Upstream project: [Human Reference Atlas 3D Reference Object Library](https://humanatlas.io/3d-reference-library)
- Data publisher: Human BioMolecular Atlas Program (HuBMAP)
- License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- Source release: Visible Human Male reference objects, release v1.2
- Files used: brain, eye, heart, large intestine, kidney, liver, lungs, pancreas, skin, and spleen
- Local modifications: the redistributed files were compressed with Meshopt by the `tejasghalsasi/anatomy-atelier` project using `@gltf-transform/cli`. Open Anatomy Studio renamed files for stable application routes and made no anatomical geometry edits.
- Retrieval date: 2026-08-04

Suggested citation for the v1.2 release:

> Schlehlein, Heidi, Bruce W. Herr II, Ellen M. Quardokus, Andreas Bueckle, and Katy Börner. 2022. HuBMAP CCF 3D Reference Object Library. Accessed May 6, 2022.

Attribution displayed inside the application:

> 3D organs © Human Reference Atlas (CC BY 4.0), HuBMAP.

The intermediary repository is referenced only to disclose the optimization step. No source code from that repository is included.
