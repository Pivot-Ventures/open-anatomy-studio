export type Language = "zh" | "en";

export type LocalizedText = {
  zh: string;
  en: string;
};

export type BodySystem =
  | "cardiovascular"
  | "nervous"
  | "respiratory"
  | "digestive"
  | "urinary"
  | "sensory"
  | "endocrine"
  | "lymphatic"
  | "integumentary";

export type Hotspot = {
  id: string;
  name: LocalizedText;
  detail: LocalizedText;
  position: [number, number, number];
};

export type AnatomyFact = {
  label: LocalizedText;
  value: LocalizedText;
};

export type AnatomyQuiz = {
  question: LocalizedText;
  options: LocalizedText[];
  answer: number;
  explanation: LocalizedText;
};

export type Organ = {
  id: string;
  name: LocalizedText;
  latin: string;
  system: BodySystem;
  model: string;
  accent: string;
  summary: LocalizedText;
  role: LocalizedText;
  facts: AnatomyFact[];
  functions: LocalizedText[];
  hotspots: Hotspot[];
  quiz: AnatomyQuiz;
};

const t = (zh: string, en: string): LocalizedText => ({ zh, en });

export const systems: Record<BodySystem, LocalizedText> = {
  cardiovascular: t("心血管系统", "Cardiovascular"),
  nervous: t("神经系统", "Nervous"),
  respiratory: t("呼吸系统", "Respiratory"),
  digestive: t("消化系统", "Digestive"),
  urinary: t("泌尿系统", "Urinary"),
  sensory: t("感觉系统", "Sensory"),
  endocrine: t("内分泌系统", "Endocrine"),
  lymphatic: t("淋巴与免疫系统", "Lymphatic and immune"),
  integumentary: t("外皮系统", "Integumentary"),
};

export const organs: Organ[] = [
  {
    id: "heart",
    name: t("心脏", "Heart"),
    latin: "Cor",
    system: "cardiovascular",
    model: "/models/heart.glb",
    accent: "#f26f65",
    summary: t(
      "由心肌构成的中空器官，通过有节律的收缩推动血液在肺循环和体循环中流动。",
      "A hollow muscular organ whose rhythmic contractions move blood through pulmonary and systemic circulation.",
    ),
    role: t("维持全身组织的氧气、营养与代谢废物运输。", "Keeps oxygen, nutrients, and metabolic waste moving through the body."),
    facts: [
      { label: t("大小", "Size"), value: t("约一个拳头大小", "About the size of a fist") },
      { label: t("重量", "Weight"), value: t("成人约 250 到 350 克", "About 250 to 350 g in adults") },
      { label: t("位置", "Location"), value: t("纵隔内，胸骨后方", "In the mediastinum, behind the sternum") },
      { label: t("静息输出", "Resting output"), value: t("每分钟约 5 升血液", "Roughly 5 L of blood per minute") },
    ],
    functions: [
      t("右心将低氧血泵向肺部", "The right heart pumps deoxygenated blood to the lungs"),
      t("左心将富氧血泵向全身", "The left heart pumps oxygenated blood to the body"),
      t("传导系统协调每一次收缩", "The conduction system coordinates each contraction"),
    ],
    hotspots: [
      { id: "aorta", name: t("主动脉", "Aorta"), detail: t("将富氧血输送到体循环的最大动脉。", "The largest artery carrying oxygenated blood into systemic circulation."), position: [0, 0.72, 0] },
      { id: "ventricle", name: t("左心室", "Left ventricle"), detail: t("壁最厚的心腔，负责将血液泵向全身。", "The thickest walled chamber, responsible for pumping blood to the body."), position: [-0.28, -0.2, 0.38] },
      { id: "atrium", name: t("右心房", "Right atrium"), detail: t("接收来自体循环的静脉血。", "Receives venous blood returning from systemic circulation."), position: [0.3, 0.28, 0.25] },
    ],
    quiz: {
      question: t("心脏壁最厚的腔室是哪一个？", "Which heart chamber has the thickest wall?"),
      options: [t("右心房", "Right atrium"), t("左心房", "Left atrium"), t("右心室", "Right ventricle"), t("左心室", "Left ventricle")],
      answer: 3,
      explanation: t("左心室必须产生足够压力，将血液推送到整个体循环。", "The left ventricle must generate enough pressure to drive blood through systemic circulation."),
    },
  },
  {
    id: "brain",
    name: t("脑", "Brain"),
    latin: "Encephalon",
    system: "nervous",
    model: "/models/brain.glb",
    accent: "#d59bbb",
    summary: t("中枢神经系统的核心，整合感觉输入，并参与运动、认知、记忆、语言与情绪。", "The core of the central nervous system, integrating sensation and supporting movement, cognition, memory, language, and emotion."),
    role: t("接收、整合并发出维持行为与内稳态的信号。", "Receives, integrates, and sends signals that sustain behavior and homeostasis."),
    facts: [
      { label: t("重量", "Weight"), value: t("成人约 1.3 到 1.4 千克", "About 1.3 to 1.4 kg in adults") },
      { label: t("主要分区", "Major regions"), value: t("大脑、小脑与脑干", "Cerebrum, cerebellum, and brainstem") },
      { label: t("保护", "Protection"), value: t("颅骨、脑膜与脑脊液", "Skull, meninges, and cerebrospinal fluid") },
      { label: t("能量需求", "Energy demand"), value: t("静息时约占全身能量的五分之一", "About one fifth of resting energy use") },
    ],
    functions: [
      t("大脑皮层参与知觉与高级认知", "The cerebral cortex supports perception and higher cognition"),
      t("小脑协调平衡与精细运动", "The cerebellum coordinates balance and fine movement"),
      t("脑干调节呼吸与循环等基本功能", "The brainstem regulates basic functions such as breathing and circulation"),
    ],
    hotspots: [
      { id: "frontal", name: t("额叶", "Frontal lobe"), detail: t("参与计划、决策、语言表达与随意运动。", "Supports planning, decision making, speech production, and voluntary movement."), position: [-0.4, 0.3, 0.42] },
      { id: "cerebellum", name: t("小脑", "Cerebellum"), detail: t("协调运动、姿势与平衡。", "Coordinates movement, posture, and balance."), position: [0.42, -0.34, 0.2] },
      { id: "temporal", name: t("颞叶", "Temporal lobe"), detail: t("参与听觉、记忆与语言理解。", "Contributes to hearing, memory, and language comprehension."), position: [0.44, -0.02, 0.42] },
    ],
    quiz: {
      question: t("主要负责协调平衡和精细运动的是哪一部分？", "Which region mainly coordinates balance and fine movement?"),
      options: [t("小脑", "Cerebellum"), t("丘脑", "Thalamus"), t("额叶", "Frontal lobe"), t("垂体", "Pituitary gland")],
      answer: 0,
      explanation: t("小脑会整合感觉信息，帮助校正运动和保持姿势。", "The cerebellum integrates sensory information to refine movement and maintain posture."),
    },
  },
  {
    id: "lungs",
    name: t("肺", "Lungs"),
    latin: "Pulmones",
    system: "respiratory",
    model: "/models/lungs.glb",
    accent: "#ef9f9b",
    summary: t("位于胸腔内的一对海绵状器官，在肺泡和毛细血管之间完成氧与二氧化碳交换。", "Paired spongy organs in the thorax that exchange oxygen and carbon dioxide between alveoli and capillaries."),
    role: t("为细胞代谢提供氧气，并排出二氧化碳。", "Supplies oxygen for cellular metabolism and removes carbon dioxide."),
    facts: [
      { label: t("肺叶", "Lobes"), value: t("右肺三叶，左肺两叶", "Three on the right, two on the left") },
      { label: t("位置", "Location"), value: t("胸腔内，心脏两侧", "In the thorax, on either side of the heart") },
      { label: t("交换单位", "Exchange unit"), value: t("肺泡", "Alveoli") },
      { label: t("主要肌肉", "Main muscle"), value: t("膈肌", "Diaphragm") },
    ],
    functions: [
      t("肺通气使空气进出肺部", "Ventilation moves air into and out of the lungs"),
      t("肺泡膜完成气体弥散", "The alveolar membrane enables gas diffusion"),
      t("呼吸系统也参与酸碱平衡", "The respiratory system also contributes to acid base balance"),
    ],
    hotspots: [
      { id: "trachea", name: t("气管", "Trachea"), detail: t("将空气从喉部传向左右主支气管。", "Carries air from the larynx toward the main bronchi."), position: [0, 0.82, 0] },
      { id: "right-lung", name: t("右肺", "Right lung"), detail: t("通常分为上、中、下三叶。", "Usually divided into superior, middle, and inferior lobes."), position: [-0.43, 0.05, 0.25] },
      { id: "left-lung", name: t("左肺", "Left lung"), detail: t("具有心切迹，为心脏留出空间。", "Has a cardiac notch that accommodates the heart."), position: [0.43, 0.05, 0.25] },
    ],
    quiz: {
      question: t("氧与二氧化碳主要在哪里交换？", "Where does most oxygen and carbon dioxide exchange occur?"),
      options: [t("气管", "Trachea"), t("肺泡", "Alveoli"), t("胸膜", "Pleura"), t("喉", "Larynx")],
      answer: 1,
      explanation: t("肺泡的薄壁紧邻毛细血管，适合气体快速扩散。", "Thin alveolar walls lie next to capillaries, enabling rapid gas diffusion."),
    },
  },
  {
    id: "liver",
    name: t("肝", "Liver"),
    latin: "Hepar",
    system: "digestive",
    model: "/models/liver.glb",
    accent: "#bc6d5e",
    summary: t("人体最大的实质性器官，参与营养代谢、解毒、胆汁生成、蛋白合成与能量储存。", "The largest solid organ, involved in nutrient metabolism, detoxification, bile production, protein synthesis, and energy storage."),
    role: t("处理来自消化道的营养物质，并维持多项代谢平衡。", "Processes nutrients arriving from the digestive tract and maintains many metabolic balances."),
    facts: [
      { label: t("重量", "Weight"), value: t("成人约 1.4 到 1.6 千克", "About 1.4 to 1.6 kg in adults") },
      { label: t("位置", "Location"), value: t("右上腹，膈肌下方", "Right upper abdomen, below the diaphragm") },
      { label: t("双重血供", "Dual blood supply"), value: t("肝动脉与肝门静脉", "Hepatic artery and portal vein") },
      { label: t("分泌物", "Secretion"), value: t("胆汁", "Bile") },
    ],
    functions: [
      t("调节糖、脂质与氨基酸代谢", "Regulates carbohydrate, lipid, and amino acid metabolism"),
      t("合成白蛋白与多种凝血因子", "Synthesizes albumin and many clotting factors"),
      t("转化和清除多种外源及内源物质", "Transforms and clears many foreign and endogenous substances"),
    ],
    hotspots: [
      { id: "right-lobe", name: t("右叶", "Right lobe"), detail: t("肝脏体积最大的叶。", "The largest lobe of the liver."), position: [-0.32, 0.12, 0.25] },
      { id: "left-lobe", name: t("左叶", "Left lobe"), detail: t("越过身体中线延伸。", "Extends across the midline of the body."), position: [0.38, 0.1, 0.25] },
      { id: "porta", name: t("肝门区域", "Porta hepatis region"), detail: t("血管、胆管和神经进出肝脏的区域。", "The region where vessels, ducts, and nerves enter or leave the liver."), position: [0.03, -0.26, 0.3] },
    ],
    quiz: {
      question: t("肝脏产生的消化相关分泌物是什么？", "Which digestive secretion is produced by the liver?"),
      options: [t("胰岛素", "Insulin"), t("胆汁", "Bile"), t("胃酸", "Gastric acid"), t("唾液", "Saliva")],
      answer: 1,
      explanation: t("肝细胞产生胆汁，胆囊可将其储存和浓缩。", "Hepatocytes produce bile, which can be stored and concentrated in the gallbladder."),
    },
  },
  {
    id: "kidney",
    name: t("肾", "Kidneys"),
    latin: "Renes",
    system: "urinary",
    model: "/models/kidney.glb",
    accent: "#cf796d",
    summary: t("腹膜后的一对器官，通过过滤血浆与选择性重吸收形成尿液并调节内环境。", "Paired retroperitoneal organs that form urine through filtration and selective reabsorption while regulating the internal environment."),
    role: t("调节体液、离子、酸碱平衡和血压，并排出代谢废物。", "Regulates fluids, ions, acid base balance, and blood pressure while excreting metabolic waste."),
    facts: [
      { label: t("位置", "Location"), value: t("脊柱两侧，腹膜后", "On either side of the spine, behind the peritoneum") },
      { label: t("功能单位", "Functional unit"), value: t("肾单位", "Nephron") },
      { label: t("血流入口", "Blood inflow"), value: t("肾动脉", "Renal artery") },
      { label: t("尿液出口", "Urine outflow"), value: t("输尿管", "Ureter") },
    ],
    functions: [
      t("肾小球过滤血浆", "Glomeruli filter blood plasma"),
      t("肾小管重吸收所需的水和溶质", "Renal tubules reclaim needed water and solutes"),
      t("分泌肾素与促红细胞生成素等调节因子", "Produces regulators including renin and erythropoietin"),
    ],
    hotspots: [
      { id: "cortex", name: t("肾皮质", "Renal cortex"), detail: t("包含肾小体和部分肾小管。", "Contains renal corpuscles and parts of renal tubules."), position: [0.22, 0.28, 0.25] },
      { id: "medulla", name: t("肾髓质", "Renal medulla"), detail: t("肾锥体所在区域，参与尿液浓缩。", "Contains renal pyramids and contributes to urine concentration."), position: [0.12, -0.05, 0.28] },
      { id: "ureter", name: t("输尿管", "Ureter"), detail: t("将尿液从肾盂输送到膀胱。", "Carries urine from the renal pelvis to the bladder."), position: [0, -0.55, 0.05] },
    ],
    quiz: {
      question: t("肾脏的基本功能单位是什么？", "What is the basic functional unit of the kidney?"),
      options: [t("肺泡", "Alveolus"), t("肝小叶", "Hepatic lobule"), t("肾单位", "Nephron"), t("神经元", "Neuron")],
      answer: 2,
      explanation: t("每个肾单位都包含过滤装置和调节滤液成分的肾小管。", "Each nephron includes a filtration apparatus and tubules that adjust the filtrate."),
    },
  },
  {
    id: "eye",
    name: t("眼球", "Eye"),
    latin: "Bulbus oculi",
    system: "sensory",
    model: "/models/eye.glb",
    accent: "#78acd0",
    summary: t("将光线聚焦到视网膜，并由光感受器把光信号转换为神经信号的感觉器官。", "A sensory organ that focuses light on the retina, where photoreceptors convert it into neural signals."),
    role: t("采集光线、形成清晰影像，并将视觉信息传向脑。", "Collects light, forms a focused image, and sends visual information to the brain."),
    facts: [
      { label: t("直径", "Diameter"), value: t("成人约 24 毫米", "About 24 mm in adults") },
      { label: t("透明前表面", "Clear front surface"), value: t("角膜", "Cornea") },
      { label: t("感光层", "Light sensing layer"), value: t("视网膜", "Retina") },
      { label: t("信号通路", "Signal pathway"), value: t("视神经", "Optic nerve") },
    ],
    functions: [
      t("角膜和晶状体共同折射光线", "The cornea and lens refract light together"),
      t("虹膜调节进入眼球的光量", "The iris regulates how much light enters"),
      t("视网膜将光转化为神经活动", "The retina converts light into neural activity"),
    ],
    hotspots: [
      { id: "cornea", name: t("角膜", "Cornea"), detail: t("眼球前方透明、弯曲的主要折光表面。", "The clear curved front surface and a major refractive element."), position: [0.55, 0, 0] },
      { id: "lens", name: t("晶状体", "Lens"), detail: t("通过改变形状帮助聚焦远近物体。", "Changes shape to help focus on near or distant objects."), position: [0.2, 0, 0] },
      { id: "optic", name: t("视神经", "Optic nerve"), detail: t("将视网膜产生的信号传向脑。", "Carries signals generated by the retina toward the brain."), position: [-0.56, 0, 0] },
    ],
    quiz: {
      question: t("眼球中包含光感受器的是哪一层？", "Which layer of the eye contains photoreceptors?"),
      options: [t("巩膜", "Sclera"), t("角膜", "Cornea"), t("视网膜", "Retina"), t("虹膜", "Iris")],
      answer: 2,
      explanation: t("视网膜中的视杆细胞和视锥细胞负责感受光。", "Rods and cones in the retina detect light."),
    },
  },
  {
    id: "pancreas",
    name: t("胰", "Pancreas"),
    latin: "Pancreas",
    system: "endocrine",
    model: "/models/pancreas.glb",
    accent: "#e6b66f",
    summary: t("兼具外分泌和内分泌功能的器官，产生消化酶，并分泌调节血糖的激素。", "An organ with exocrine and endocrine roles, producing digestive enzymes and hormones that regulate blood glucose."),
    role: t("协助消化蛋白质、脂肪与碳水化合物，并维持血糖稳定。", "Helps digest protein, fat, and carbohydrate while stabilizing blood glucose."),
    facts: [
      { label: t("位置", "Location"), value: t("胃后方，横跨上腹部", "Behind the stomach, across the upper abdomen") },
      { label: t("外分泌", "Exocrine role"), value: t("消化酶和碳酸氢盐", "Digestive enzymes and bicarbonate") },
      { label: t("内分泌", "Endocrine role"), value: t("胰岛激素", "Islet hormones") },
      { label: t("主要血糖激素", "Key glucose hormones"), value: t("胰岛素与胰高血糖素", "Insulin and glucagon") },
    ],
    functions: [
      t("腺泡细胞产生消化酶", "Acinar cells produce digestive enzymes"),
      t("导管细胞分泌碳酸氢盐", "Duct cells secrete bicarbonate"),
      t("胰岛细胞分泌调节血糖的激素", "Islet cells release hormones that regulate blood glucose"),
    ],
    hotspots: [
      { id: "head", name: t("胰头", "Head"), detail: t("位于十二指肠形成的弯曲内。", "Sits within the curve formed by the duodenum."), position: [0.38, -0.05, 0.1] },
      { id: "body", name: t("胰体", "Body"), detail: t("横过腹部中线的中央部分。", "The central portion crossing the abdominal midline."), position: [0, 0.05, 0.1] },
      { id: "tail", name: t("胰尾", "Tail"), detail: t("向左延伸并接近脾。", "Extends leftward toward the spleen."), position: [-0.42, 0.06, 0.1] },
    ],
    quiz: {
      question: t("哪一种胰腺激素主要降低血糖？", "Which pancreatic hormone mainly lowers blood glucose?"),
      options: [t("肾上腺素", "Epinephrine"), t("胰岛素", "Insulin"), t("胰高血糖素", "Glucagon"), t("甲状腺素", "Thyroxine")],
      answer: 1,
      explanation: t("胰岛素促进细胞摄取葡萄糖，并支持能量储存。", "Insulin promotes glucose uptake by cells and supports energy storage."),
    },
  },
  {
    id: "intestine",
    name: t("大肠", "Large intestine"),
    latin: "Intestinum crassum",
    system: "digestive",
    model: "/models/intestine.glb",
    accent: "#d89278",
    summary: t("消化道末段，吸收剩余水分和电解质，并将不可消化物质转化为粪便。", "The final digestive segment, absorbing remaining water and electrolytes and forming feces from indigestible material."),
    role: t("回收水和电解质，容纳肠道微生物，并完成排便前的储存。", "Recovers water and electrolytes, hosts gut microbes, and stores material before defecation."),
    facts: [
      { label: t("主要部分", "Main parts"), value: t("盲肠、结肠、直肠与肛管", "Cecum, colon, rectum, and anal canal") },
      { label: t("长度", "Length"), value: t("成人约 1.5 米", "About 1.5 m in adults") },
      { label: t("主要吸收", "Main absorption"), value: t("水和电解质", "Water and electrolytes") },
      { label: t("特征", "Feature"), value: t("结肠袋和结肠带", "Haustra and teniae coli") },
    ],
    functions: [
      t("吸收消化内容物中的剩余水分", "Absorbs remaining water from digestive contents"),
      t("肠道菌群代谢部分未消化底物", "Gut microbes metabolize some undigested substrates"),
      t("推动、压缩并储存粪便", "Moves, compacts, and stores fecal material"),
    ],
    hotspots: [
      { id: "ascending", name: t("升结肠", "Ascending colon"), detail: t("从盲肠向上延伸至肝曲。", "Runs upward from the cecum to the hepatic flexure."), position: [-0.42, 0.1, 0.25] },
      { id: "transverse", name: t("横结肠", "Transverse colon"), detail: t("横跨腹部上方的结肠段。", "The segment crossing the upper abdomen."), position: [0, 0.48, 0.22] },
      { id: "sigmoid", name: t("乙状结肠", "Sigmoid colon"), detail: t("连接降结肠与直肠的 S 形段。", "The S shaped segment linking the descending colon to the rectum."), position: [0.32, -0.44, 0.2] },
    ],
    quiz: {
      question: t("大肠的主要吸收功能是什么？", "What is the main absorptive role of the large intestine?"),
      options: [t("氨基酸", "Amino acids"), t("脂肪酸", "Dietary fats"), t("水和电解质", "Water and electrolytes"), t("氧气", "Oxygen")],
      answer: 2,
      explanation: t("大部分营养物质已在小肠吸收，大肠主要回收剩余水分与电解质。", "Most nutrients are absorbed in the small intestine, while the large intestine mainly recovers remaining water and electrolytes."),
    },
  },
  {
    id: "spleen",
    name: t("脾", "Spleen"),
    latin: "Lien",
    system: "lymphatic",
    model: "/models/spleen.glb",
    accent: "#a887b1",
    summary: t("位于左上腹的淋巴器官，过滤血液、清除老化红细胞，并支持针对血源性病原体的免疫反应。", "A lymphatic organ in the left upper abdomen that filters blood, removes aged red cells, and supports immune responses to blood borne pathogens."),
    role: t("监测血液中的抗原，回收血细胞成分，并储存部分血小板。", "Monitors blood for antigens, recycles blood cell components, and stores a portion of platelets."),
    facts: [
      { label: t("位置", "Location"), value: t("左上腹，第九到第十一肋深面", "Left upper abdomen, deep to ribs 9 to 11") },
      { label: t("白髓", "White pulp"), value: t("免疫监测", "Immune surveillance") },
      { label: t("红髓", "Red pulp"), value: t("过滤血液", "Blood filtration") },
      { label: t("所属", "Belongs to"), value: t("淋巴与免疫系统", "Lymphatic and immune system") },
    ],
    functions: [
      t("清除老化或受损的红细胞", "Removes aged or damaged red blood cells"),
      t("激活针对血源性抗原的免疫反应", "Activates immune responses to blood borne antigens"),
      t("回收红细胞中的铁成分", "Recycles iron from red blood cells"),
    ],
    hotspots: [
      { id: "superior", name: t("上极", "Superior pole"), detail: t("脾脏靠近膈肌的上端。", "The upper end of the spleen near the diaphragm."), position: [0, 0.42, 0.08] },
      { id: "hilum", name: t("脾门", "Splenic hilum"), detail: t("脾血管和神经进出的凹陷区域。", "The indented region where splenic vessels and nerves enter or leave."), position: [0.12, 0, 0.2] },
      { id: "inferior", name: t("下极", "Inferior pole"), detail: t("脾脏朝向下方的末端。", "The lower end of the spleen."), position: [0, -0.42, 0.08] },
    ],
    quiz: {
      question: t("脾红髓的主要作用之一是什么？", "What is one major role of splenic red pulp?"),
      options: [t("产生胆汁", "Producing bile"), t("过滤血液", "Filtering blood"), t("分泌胰岛素", "Secreting insulin"), t("形成尿液", "Forming urine")],
      answer: 1,
      explanation: t("红髓会清除老化红细胞并回收其部分成分。", "Red pulp removes aged red cells and recycles some of their components."),
    },
  },
  {
    id: "skin",
    name: t("皮肤", "Skin"),
    latin: "Cutis",
    system: "integumentary",
    model: "/models/skin.glb",
    accent: "#d5a07d",
    summary: t("覆盖身体表面的多层器官，形成屏障并参与感觉、体温调节、免疫防御和维生素 D 合成。", "A layered organ covering the body surface, forming a barrier and contributing to sensation, temperature control, immune defense, and vitamin D synthesis."),
    role: t("在体内与外界之间建立可调节的保护界面。", "Creates a regulated protective interface between the body and its environment."),
    facts: [
      { label: t("主要层次", "Main layers"), value: t("表皮与真皮", "Epidermis and dermis") },
      { label: t("皮下组织", "Subcutaneous tissue"), value: t("位于皮肤下方，不属于皮肤本体", "Lies below the skin and is not part of the skin itself") },
      { label: t("最大器官", "Largest organ"), value: t("按表面积计", "By surface area") },
      { label: t("屏障蛋白", "Barrier protein"), value: t("角蛋白", "Keratin") },
    ],
    functions: [
      t("限制水分流失并阻挡多种外界因素", "Limits water loss and blocks many external agents"),
      t("感觉受体检测触觉、温度和痛觉", "Sensory receptors detect touch, temperature, and pain"),
      t("血流和汗液帮助调节体温", "Blood flow and sweating help regulate body temperature"),
    ],
    hotspots: [
      { id: "epidermis", name: t("表皮", "Epidermis"), detail: t("无血管的外层上皮，构成主要屏障。", "The avascular outer epithelium that forms the main barrier."), position: [0, 0.36, 0.15] },
      { id: "dermis", name: t("真皮", "Dermis"), detail: t("富含结缔组织，并容纳血管、神经和附属器。", "Connective tissue rich layer containing vessels, nerves, and appendages."), position: [0, 0.02, 0.15] },
      { id: "subcutis", name: t("皮下组织", "Subcutaneous tissue"), detail: t("主要由疏松结缔组织和脂肪构成。", "Composed mainly of loose connective tissue and adipose tissue."), position: [0, -0.36, 0.15] },
    ],
    quiz: {
      question: t("皮肤最外层的主要名称是什么？", "What is the name of the outermost main layer of skin?"),
      options: [t("表皮", "Epidermis"), t("真皮", "Dermis"), t("筋膜", "Fascia"), t("骨膜", "Periosteum")],
      answer: 0,
      explanation: t("表皮是皮肤的外层，真皮位于其下方。", "The epidermis is the outer layer of the skin, with the dermis beneath it."),
    },
  },
];

export const organById = Object.fromEntries(organs.map((organ) => [organ.id, organ])) as Record<string, Organ>;

export const anatomySources = [
  {
    id: "hra",
    title: t("Human Reference Atlas 3D 参考对象库", "Human Reference Atlas 3D Reference Object Library"),
    detail: t("本项目 3D 模型来源。模型以 CC BY 4.0 发布，并由 HuBMAP 人体参考图谱项目维护。", "Source of the 3D models. The objects are released under CC BY 4.0 and maintained by the HuBMAP Human Reference Atlas project."),
    url: "https://humanatlas.io/3d-reference-library",
  },
  {
    id: "openstax",
    title: t("OpenStax Anatomy and Physiology 2e", "OpenStax Anatomy and Physiology 2e"),
    detail: t("器官结构和生理功能的基础参考资料，采用 CC BY 4.0 许可。", "A foundational reference for organ structure and physiology, licensed under CC BY 4.0."),
    url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
  },
  {
    id: "medlineplus",
    title: t("美国国立医学图书馆 MedlinePlus", "U.S. National Library of Medicine MedlinePlus"),
    detail: t("面向公众的健康与人体系统参考入口。", "A public reference entry point for health and body systems."),
    url: "https://medlineplus.gov/anatomy.html",
  },
];

export const localize = (value: LocalizedText, lang: Language) => value[lang];
