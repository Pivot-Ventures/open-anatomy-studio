# Human Atlas Organ Studio product strategy

### 1. Assessment of the references

The original project offers excellent visual polish and precise raw Three.js control, but its public repository does not include a root code license or a complete public asset ledger. The direct clone is useful evidence that deployment adaptation alone does not create a distinct product. The R3F based atelier has the strongest open asset story through HuBMAP CC BY 4.0 models, but its code is unlicensed at the root and its section feature is a translucent plane rather than geometric clipping.

Open Anatomy Studio therefore uses a clean-room implementation. It studies capabilities, not source expressions. Only clearly licensed Human Reference Atlas data is redistributed, with attribution and modification disclosure.

### 2. Product position

Open Anatomy Studio is a bilingual 3D learning studio for students, educators, and curious learners, with medical anatomy as its first flagship discipline. It opens directly into exploration and keeps disciplines, lessons, scenes, activities, assessments, content sources, and model provenance as separate auditable layers.

The application is educational only. It is not a diagnostic product and does not replace a textbook, clinician, or professional training.

### 3. What makes this version stronger

- Typed bilingual content across organs, systems, facts, labels, and quizzes.
- Real model interaction with selection, focus, semantic mesh names, and material clipping.
- A guided heart lesson that connects locating, section observation, and assessment, while other organs retain free exploration and a quick quiz.
- A discipline-agnostic learning contract for topics, lessons, scenes, entities, activities, assessments, and source references. Medical anatomy is currently the only active discipline.
- In-product provenance with source links, license boundaries, asset attribution, and a medical disclaimer.
- Progressive loading, next-model prefetch, Meshopt files, adaptive pixel density, lower-cost shadows, and reduced motion behavior.
- A first-screen desktop workbench, a bounded mobile content flow, compact mobile navigation, and a non-WebGL text fallback.

### 4. Roadmap

P1 should extend the heart pilot's fact-level citations and review metadata to every organ, add ontology mapping, provide a static-image fallback, and complete manual accessibility review. P2 should validate a second discipline with a parameter-driven or process-based scene before adding system courses, spaced review, classroom presentation, and exportable learning records. Accounts, cloud sync, collaborative notes, or AI tutoring belong later, after review and provenance are stronger.

## 2026-09 update

The studio now ships 26 Human Reference Atlas organ models across 11 body systems, keeps every named structure selectable, renders tissue with physically based materials, and adds explode, layer, cut-axis, snapshot, and full-screen functions. It is hosted as the Organs tab of the EASI Human Atlas desk. The interface is English only.
