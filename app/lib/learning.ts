import type { LocalizedText } from "./anatomy";

export type DisciplineId =
  | "medical-anatomy"
  | "biology"
  | "chemistry"
  | "physics"
  | "earth-science"
  | "engineering";

export type LearningSourceRef = {
  sourceId: string;
  note: LocalizedText;
};

export type LearningEntity = {
  id: string;
  kind: "organ" | "structure" | "process" | "concept";
  name: LocalizedText;
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
  title: LocalizedText;
  instruction: LocalizedText;
  success: LocalizedText;
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
  title: LocalizedText;
  durationMinutes: number;
  objective: LocalizedText;
  scene: LearningScene;
  activities: LearningActivity[];
  assessments: LearningAssessment[];
  sourceRefs: LearningSourceRef[];
};

export type LearningTopic = {
  id: string;
  title: LocalizedText;
  lessonIds: string[];
};

export type LearningDiscipline = {
  id: DisciplineId;
  title: LocalizedText;
  status: "active" | "planned";
  topicIds: string[];
};

const t = (zh: string, en: string): LocalizedText => ({ zh, en });

/**
 * The heart lesson is the first vertical slice of the discipline-agnostic
 * learning contract. Future disciplines can supply other renderers while
 * reusing the same lesson, activity, assessment, and source boundaries.
 */
export const heartGuidedLesson: LearningLesson = {
  id: "heart-blood-flow-basics",
  disciplineId: "medical-anatomy",
  topicId: "cardiovascular-foundations",
  title: t("心脏结构导学", "Guided heart structure"),
  durationMinutes: 4,
  objective: t(
    "定位左心室，观察心脏内部，并用一道题解释结构与泵血压力的关系。",
    "Locate the left ventricle, inspect the heart interior, and explain how structure relates to pumping pressure.",
  ),
  scene: {
    id: "heart-3d-scene",
    renderer: "3d",
    organId: "heart",
    initialHotspotId: "aorta",
    entities: [
      { id: "heart", kind: "organ", name: t("心脏", "Heart") },
      { id: "ventricle", kind: "structure", name: t("左心室", "Left ventricle") },
      { id: "aorta", kind: "structure", name: t("主动脉", "Aorta") },
    ],
  },
  activities: [
    {
      id: "heart-locate-ventricle",
      kind: "locate",
      targetHotspotId: "ventricle",
      title: t("定位", "Locate"),
      instruction: t("在 3D 标本上选择左心室标注。", "Select the left ventricle label on the 3D specimen."),
      success: t("已定位左心室。", "Left ventricle located."),
    },
    {
      id: "heart-section-interior",
      kind: "section",
      minimumDepth: 0.18,
      title: t("观察", "Observe"),
      instruction: t("开启剖切模式，并将剖切深度移动到 0.18 以上。", "Turn on section mode and move section depth beyond 0.18."),
      success: t("已完成内部观察。", "Interior observation complete."),
    },
    {
      id: "heart-check-understanding",
      kind: "quiz",
      assessmentId: "heart-wall-thickness-check",
      title: t("解释", "Explain"),
      instruction: t("完成快速测验，验证结构与压力的关系。", "Complete the quick quiz to check the structure-pressure relationship."),
      success: t("测验通过，导学闭环完成。", "Quiz passed and the guided loop is complete."),
    },
  ],
  assessments: [
    {
      id: "heart-wall-thickness-check",
      kind: "single-choice",
      organId: "heart",
      sourceRefs: [
        { sourceId: "openstax", note: t("心腔结构与循环功能", "Heart chamber structure and circulatory function") },
      ],
    },
  ],
  sourceRefs: [
    { sourceId: "openstax", note: t("心脏解剖与循环基础", "Heart anatomy and circulation foundations") },
    { sourceId: "medlineplus", note: t("公众健康参考入口", "Public health reference entry point") },
  ],
};

export const learningTopics: LearningTopic[] = [
  {
    id: "cardiovascular-foundations",
    title: t("心血管基础", "Cardiovascular foundations"),
    lessonIds: [heartGuidedLesson.id],
  },
];

export const learningDisciplines: LearningDiscipline[] = [
  {
    id: "medical-anatomy",
    title: t("医学解剖", "Medical anatomy"),
    status: "active",
    topicIds: learningTopics.map((topic) => topic.id),
  },
];
