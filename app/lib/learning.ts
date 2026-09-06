export type DisciplineId =
  | "medical-anatomy"
  | "biology"
  | "chemistry"
  | "physics"
  | "earth-science"
  | "engineering";

export type LearningSourceRef = {
  sourceId: string;
  note: string;
};

export type LearningEntity = {
  id: string;
  kind: "organ" | "structure" | "process" | "concept";
  name: string;
};

export type LearningScene = {
  id: string;
  renderer: "3d" | "diagram" | "simulation";
  organId?: string;
  initialHotspotId?: string;
  entities: LearningEntity[];
};

type ActivityBase = {
  id: string;
  title: string;
  instruction: string;
  success: string;
};

export type LearningActivity =
  | (ActivityBase & {
      kind: "locate";
      targetHotspotId: string;
    })
  | (ActivityBase & {
      kind: "section";
      minimumDepth: number;
    })
  | (ActivityBase & {
      kind: "explode";
      minimumAmount: number;
    })
  | (ActivityBase & {
      kind: "quiz";
      assessmentId: string;
    });

export type LearningAssessment = {
  id: string;
  kind: "single-choice";
  organId: string;
  sourceRefs: LearningSourceRef[];
};

export type LearningLesson = {
  id: string;
  disciplineId: DisciplineId;
  topicId: string;
  title: string;
  durationMinutes: number;
  objective: string;
  scene: LearningScene;
  activities: LearningActivity[];
  assessments: LearningAssessment[];
  sourceRefs: LearningSourceRef[];
};

export type LearningTopic = {
  id: string;
  title: string;
  lessonIds: string[];
};

export type LearningDiscipline = {
  id: DisciplineId;
  title: string;
  status: "active" | "planned";
  topicIds: string[];
};

/**
 * Guided lessons are the vertical slice of the discipline-agnostic learning
 * contract. Each lesson binds a 3D scene to locate, section, explode, and
 * quiz activities that the studio can verify as the learner works.
 */
export const heartGuidedLesson: LearningLesson = {
  id: "heart-blood-flow-basics",
  disciplineId: "medical-anatomy",
  topicId: "cardiovascular-foundations",
  title: "Guided heart structure",
  durationMinutes: 4,
  objective: "Locate the left ventricle, inspect the heart interior, and explain how structure relates to pumping pressure.",
  scene: {
    id: "heart-3d-scene",
    renderer: "3d",
    organId: "heart",
    initialHotspotId: "ventricle",
    entities: [
      { id: "heart", kind: "organ", name: "Heart" },
      { id: "ventricle", kind: "structure", name: "Left ventricle" },
      { id: "septum", kind: "structure", name: "Interventricular septum" },
    ],
  },
  activities: [
    {
      id: "heart-locate-ventricle",
      kind: "locate",
      targetHotspotId: "ventricle",
      title: "Locate",
      instruction: "Select the left ventricle label on the 3D specimen.",
      success: "Left ventricle located.",
    },
    {
      id: "heart-section-interior",
      kind: "section",
      minimumDepth: 0.18,
      title: "Observe",
      instruction: "Turn on section mode and move the section depth beyond 0.18 to look inside the chambers.",
      success: "Interior observation complete.",
    },
    {
      id: "heart-explode-parts",
      kind: "explode",
      minimumAmount: 0.4,
      title: "Separate",
      instruction: "Use explode to pull the chambers and valves apart and see how they fit together.",
      success: "Chambers and valves separated.",
    },
    {
      id: "heart-check-understanding",
      kind: "quiz",
      assessmentId: "heart-wall-thickness-check",
      title: "Explain",
      instruction: "Complete the quick quiz to check the structure-pressure relationship.",
      success: "Quiz passed and the guided loop is complete.",
    },
  ],
  assessments: [
    {
      id: "heart-wall-thickness-check",
      kind: "single-choice",
      organId: "heart",
      sourceRefs: [{ sourceId: "openstax", note: "Heart chamber structure and circulatory function" }],
    },
  ],
  sourceRefs: [
    { sourceId: "openstax", note: "Heart anatomy and circulation foundations" },
    { sourceId: "medlineplus", note: "Public health reference entry point" },
  ],
};

export const kidneyGuidedLesson: LearningLesson = {
  id: "kidney-filtration-basics",
  disciplineId: "medical-anatomy",
  topicId: "urinary-foundations",
  title: "Inside the kidney",
  durationMinutes: 4,
  objective: "Find the cortex and a renal pyramid, cut the kidney open, and explain where urine forms and where it collects.",
  scene: {
    id: "kidney-3d-scene",
    renderer: "3d",
    organId: "kidney",
    initialHotspotId: "cortex",
    entities: [
      { id: "kidney", kind: "organ", name: "Kidney" },
      { id: "cortex", kind: "structure", name: "Outer cortex" },
      { id: "pyramid", kind: "structure", name: "Renal pyramid" },
    ],
  },
  activities: [
    {
      id: "kidney-locate-cortex",
      kind: "locate",
      targetHotspotId: "cortex",
      title: "Locate",
      instruction: "Select the outer cortex label, where the glomeruli filter the blood.",
      success: "Cortex located.",
    },
    {
      id: "kidney-locate-pyramid",
      kind: "locate",
      targetHotspotId: "pyramid",
      title: "Locate",
      instruction: "Now select a renal pyramid, where urine drains toward the papilla.",
      success: "Renal pyramid located.",
    },
    {
      id: "kidney-section-interior",
      kind: "section",
      minimumDepth: 0.15,
      title: "Observe",
      instruction: "Turn on section mode and cut past 0.15 to expose the pyramids inside the capsule.",
      success: "Kidney interior exposed.",
    },
    {
      id: "kidney-check-understanding",
      kind: "quiz",
      assessmentId: "kidney-nephron-check",
      title: "Explain",
      instruction: "Complete the quick quiz on the working unit of the kidney.",
      success: "Quiz passed and the guided loop is complete.",
    },
  ],
  assessments: [
    {
      id: "kidney-nephron-check",
      kind: "single-choice",
      organId: "kidney",
      sourceRefs: [{ sourceId: "openstax", note: "Kidney structure and the nephron" }],
    },
  ],
  sourceRefs: [{ sourceId: "openstax", note: "Urinary system foundations" }],
};

export const lungsGuidedLesson: LearningLesson = {
  id: "lungs-airway-tree",
  disciplineId: "medical-anatomy",
  topicId: "respiratory-foundations",
  title: "The airway tree",
  durationMinutes: 4,
  objective: "Trace air from the hilum into a lung segment, separate the segments, and explain where gas exchange happens.",
  scene: {
    id: "lungs-3d-scene",
    renderer: "3d",
    organId: "lungs",
    initialHotspotId: "right-hilum",
    entities: [
      { id: "lungs", kind: "organ", name: "Lungs" },
      { id: "right-hilum", kind: "structure", name: "Right hilum" },
      { id: "right-apex", kind: "structure", name: "Right apical segment" },
    ],
  },
  activities: [
    {
      id: "lungs-locate-hilum",
      kind: "locate",
      targetHotspotId: "right-hilum",
      title: "Locate",
      instruction: "Select the right hilum, where the main bronchus enters the lung.",
      success: "Right hilum located.",
    },
    {
      id: "lungs-explode-segments",
      kind: "explode",
      minimumAmount: 0.35,
      title: "Separate",
      instruction: "Use explode to pull the bronchopulmonary segments apart and reveal the bronchial tree.",
      success: "Segments separated and the bronchial tree revealed.",
    },
    {
      id: "lungs-check-understanding",
      kind: "quiz",
      assessmentId: "lungs-alveoli-check",
      title: "Explain",
      instruction: "Complete the quick quiz on where gases are exchanged.",
      success: "Quiz passed and the guided loop is complete.",
    },
  ],
  assessments: [
    {
      id: "lungs-alveoli-check",
      kind: "single-choice",
      organId: "lungs",
      sourceRefs: [{ sourceId: "openstax", note: "Lung structure and gas exchange" }],
    },
  ],
  sourceRefs: [{ sourceId: "openstax", note: "Respiratory system foundations" }],
};

export const guidedLessons: LearningLesson[] = [heartGuidedLesson, kidneyGuidedLesson, lungsGuidedLesson];

export const lessonByOrganId = Object.fromEntries(
  guidedLessons.filter((lesson) => lesson.scene.organId).map((lesson) => [lesson.scene.organId as string, lesson]),
) as Record<string, LearningLesson>;

export const learningTopics: LearningTopic[] = [
  { id: "cardiovascular-foundations", title: "Cardiovascular foundations", lessonIds: [heartGuidedLesson.id] },
  { id: "urinary-foundations", title: "Urinary foundations", lessonIds: [kidneyGuidedLesson.id] },
  { id: "respiratory-foundations", title: "Respiratory foundations", lessonIds: [lungsGuidedLesson.id] },
];

export const learningDisciplines: LearningDiscipline[] = [
  {
    id: "medical-anatomy",
    title: "Medical anatomy",
    status: "active",
    topicIds: learningTopics.map((topic) => topic.id),
  },
];
