export type BodySystem =
  | "cardiovascular"
  | "respiratory"
  | "digestive"
  | "urinary"
  | "nervous"
  | "sensory"
  | "endocrine"
  | "lymphatic"
  | "integumentary"
  | "skeletal"
  | "reproductive";

/**
 * A labelled point on the 3D model. Labels anchored to a `mesh` are placed at
 * the centre of that named structure at runtime, so they follow the real
 * geometry. Labels without a mesh use a fixed position in normalised model
 * space (the model is centred and scaled so its longest side is 1.72 units).
 */
export type Hotspot = {
  id: string;
  name: string;
  detail: string;
  mesh?: string;
  position?: [number, number, number];
};

export type AnatomyFact = {
  label: string;
  value: string;
  sourceIds?: string[];
  reviewStatus?: "draft" | "reviewed";
  lastReviewed?: string;
};

export type AnatomyQuiz = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

/** A descriptive anatomical term and its plain-English meaning. */
export type DescriptiveTerm = {
  term: string;
  meaning: string;
};

export type TissueKind =
  | "muscle"
  | "neural"
  | "lung"
  | "liver"
  | "gland"
  | "mucosa"
  | "kidney"
  | "vessel"
  | "bone"
  | "cartilage"
  | "eye"
  | "lymphoid"
  | "skin";

export type Organ = {
  id: string;
  name: string;
  latin: string;
  system: BodySystem;
  model?: string;
  modelKind?: "gltf" | "skin-patch";
  modelSource?: "hra" | "bp3d" | "local";
  /** Default tissue appearance for meshes that no material rule matches. */
  tissue: TissueKind;
  accent: string;
  summary: string;
  role: string;
  modelScope?: string;
  facts: AnatomyFact[];
  functions: string[];
  terms: DescriptiveTerm[];
  hotspots: Hotspot[];
  quiz: AnatomyQuiz;
};

export const systems: Record<BodySystem, string> = {
  cardiovascular: "Cardiovascular",
  respiratory: "Respiratory",
  digestive: "Digestive",
  urinary: "Urinary",
  nervous: "Nervous",
  sensory: "Sensory",
  endocrine: "Endocrine",
  lymphatic: "Lymphatic and immune",
  integumentary: "Integumentary",
  skeletal: "Skeletal",
  reproductive: "Reproductive",
};

const hra = (file: string) => `models/${file}.glb`;
const bp3d = hra;

export const organs: Organ[] = [
  {
    id: "heart",
    name: "Heart",
    latin: "Cor",
    system: "cardiovascular",
    model: hra("heart"),
    tissue: "muscle",
    accent: "#f26f65",
    summary:
      "A hollow muscular organ whose rhythmic contractions move blood through pulmonary and systemic circulation. Four chambers and four valves keep the flow one way.",
    role: "Keeps oxygen, nutrients, and metabolic waste moving through the body.",
    facts: [
      { label: "Size", value: "About the size of a closed fist", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Weight", value: "About 250 to 350 g in adults", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Location", value: "In the mediastinum, behind the sternum, tilted to the left", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Resting output", value: "Roughly 5 L of blood per minute", sourceIds: ["openstax"], reviewStatus: "draft" },
    ],
    functions: [
      "The right heart pumps deoxygenated blood to the lungs",
      "The left heart pumps oxygenated blood to the body",
      "The conduction system coordinates each contraction",
    ],
    terms: [
      { term: "Atrium", meaning: "An upper receiving chamber that collects blood returning to the heart." },
      { term: "Ventricle", meaning: "A lower pumping chamber with thick muscular walls." },
      { term: "Myocardium", meaning: "The cardiac muscle layer that does the pumping work." },
      { term: "Septum", meaning: "The muscular wall that separates the left and right sides." },
      { term: "Valve", meaning: "A flap of tissue that opens one way so blood cannot flow backwards." },
      { term: "Papillary muscle", meaning: "Small muscles that hold the valve cords taut so the valves do not turn inside out." },
    ],
    hotspots: [
      { id: "ventricle", name: "Left ventricle", detail: "The thickest walled chamber, responsible for pumping blood to the whole body.", mesh: "VH_M_heart_left_ventricle" },
      { id: "atrium", name: "Right atrium", detail: "Receives venous blood returning from systemic circulation through the venae cavae.", mesh: "VH_M_right_cardiac_atrium" },
      { id: "septum", name: "Interventricular septum", detail: "The muscular wall between the two ventricles that keeps oxygenated and deoxygenated blood apart.", mesh: "VH_M_interventricular_septum" },
      { id: "aortic-valve", name: "Aortic valve", detail: "A three-cusp valve at the exit of the left ventricle that opens into the aorta.", mesh: "VH_M_aortic_valve" },
      { id: "mitral", name: "Mitral valve", detail: "The two-flap valve between the left atrium and the left ventricle.", mesh: "VH_M_mitral_valve" },
    ],
    quiz: {
      question: "Which heart chamber has the thickest wall?",
      options: ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"],
      answer: 3,
      explanation: "The left ventricle must generate enough pressure to drive blood through systemic circulation.",
    },
  },
  {
    id: "vasculature",
    name: "Major blood vessels",
    latin: "Vasa sanguinea",
    system: "cardiovascular",
    model: hra("vasculature"),
    tissue: "vessel",
    accent: "#e05a6d",
    summary:
      "The great arteries and veins of the trunk: the aorta and its branches carrying oxygenated blood away from the heart, and the venae cavae and portal system returning blood to it.",
    role: "Distributes blood from the heart to every organ and returns it for reoxygenation.",
    modelScope: "This model shows the major trunk vessels only. Limb, head, and microscopic vessels are not included.",
    facts: [
      { label: "Largest artery", value: "The aorta, about 2.5 to 3 cm wide at its root", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Largest veins", value: "The superior and inferior venae cavae" },
      { label: "Artery walls", value: "Thick, elastic, and muscular to withstand high pressure" },
      { label: "Vein walls", value: "Thinner, with valves in the limbs to stop backflow" },
    ],
    functions: [
      "Arteries carry blood away from the heart under high pressure",
      "Veins return blood to the heart at low pressure",
      "The hepatic portal vein delivers nutrient-rich blood from the gut to the liver",
    ],
    terms: [
      { term: "Artery", meaning: "A vessel that carries blood away from the heart." },
      { term: "Vein", meaning: "A vessel that carries blood back toward the heart." },
      { term: "Aortic arch", meaning: "The curved part of the aorta that gives off arteries to the head and arms." },
      { term: "Vena cava", meaning: "One of the two great veins that empty into the right atrium." },
      { term: "Portal vein", meaning: "A vein that carries blood from one organ directly to another rather than to the heart." },
      { term: "Pulmonary trunk", meaning: "The artery that carries deoxygenated blood from the right ventricle to the lungs." },
    ],
    hotspots: [
      { id: "arch", name: "Aortic arch", detail: "Gives off the brachiocephalic, left common carotid, and left subclavian arteries.", mesh: "VH_M_aortic_arch" },
      { id: "svc", name: "Superior vena cava", detail: "Returns blood from the head, neck, and arms to the right atrium.", mesh: "VH_M_superior_vena_cava" },
      { id: "pulmonary", name: "Pulmonary trunk", detail: "Carries deoxygenated blood from the right ventricle and splits into the two pulmonary arteries.", mesh: "VH_M_pulmonary_trunk" },
      { id: "portal", name: "Hepatic portal vein", detail: "Carries blood rich in absorbed nutrients from the intestines to the liver.", mesh: "VH_M_hepatic_portal_vein" },
      { id: "renal", name: "Left renal artery", detail: "Branches from the abdominal aorta to supply the left kidney.", mesh: "VH_M_left_renal_artery" },
    ],
    quiz: {
      question: "Which vessel carries deoxygenated blood away from the heart?",
      options: ["Aorta", "Pulmonary trunk", "Superior vena cava", "Hepatic portal vein"],
      answer: 1,
      explanation: "The pulmonary trunk leaves the right ventricle carrying deoxygenated blood to the lungs. It is the exception to the rule that arteries carry oxygenated blood.",
    },
  },
  {
    id: "brain",
    name: "Brain",
    latin: "Encephalon",
    system: "nervous",
    model: hra("brain"),
    tissue: "neural",
    accent: "#d59bbb",
    summary:
      "The core of the central nervous system, integrating sensation and supporting movement, cognition, memory, language, and emotion. The model is divided into hundreds of named regions from the Allen Human Brain Atlas.",
    role: "Receives, integrates, and sends signals that sustain behaviour and homeostasis.",
    facts: [
      { label: "Weight", value: "About 1.3 to 1.4 kg in adults", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Major regions", value: "Cerebrum, cerebellum, and brainstem" },
      { label: "Protection", value: "Skull, meninges, and cerebrospinal fluid" },
      { label: "Energy demand", value: "About one fifth of resting energy use" },
    ],
    functions: [
      "The cerebral cortex supports perception and higher cognition",
      "The cerebellum coordinates balance and fine movement",
      "The brainstem regulates basic functions such as breathing and circulation",
    ],
    terms: [
      { term: "Cerebrum", meaning: "The large, folded upper part of the brain, divided into two hemispheres." },
      { term: "Gyrus", meaning: "A ridge or fold on the surface of the cerebrum." },
      { term: "Sulcus", meaning: "A groove between two gyri." },
      { term: "Lobe", meaning: "One of the four main regions of each hemisphere: frontal, parietal, temporal, and occipital." },
      { term: "Cerebellum", meaning: "The small brain at the back that fine-tunes movement and balance." },
      { term: "Brainstem", meaning: "The stalk connecting the brain to the spinal cord: midbrain, pons, and medulla." },
      { term: "Thalamus", meaning: "A relay station that passes sensory information to the cortex." },
      { term: "Corpus callosum", meaning: "The thick band of fibres that connects the two hemispheres." },
    ],
    hotspots: [
      { id: "frontal", name: "Frontal lobe", detail: "Supports planning, decision making, speech production, and voluntary movement.", mesh: "Allen_superior_frontal_gyrus_L" },
      { id: "motor", name: "Primary motor cortex", detail: "The strip of cortex that sends commands to the skeletal muscles.", mesh: "Allen_primary_motor_cortex_L" },
      { id: "cerebellum", name: "Cerebellum", detail: "Coordinates movement, posture, and balance.", mesh: "Allen_lateral_hemisphere_of_cerebellum_L" },
      { id: "pons", name: "Pons", detail: "Part of the brainstem that relays signals and helps regulate breathing.", mesh: "Allen_basilar_part_of_pons_L" },
      { id: "thalamus", name: "Thalamus", detail: "Relays almost all sensory input to the cerebral cortex.", mesh: "Allen_thalamus_L" },
      { id: "occipital", name: "Occipital pole", detail: "The rear of the brain, home to the primary visual cortex.", mesh: "Allen_occipital_pole_L" },
    ],
    quiz: {
      question: "Which region mainly coordinates balance and fine movement?",
      options: ["Cerebellum", "Thalamus", "Frontal lobe", "Pituitary gland"],
      answer: 0,
      explanation: "The cerebellum integrates sensory information to refine movement and maintain posture.",
    },
  },
  {
    id: "spinal_cord",
    name: "Spinal cord",
    latin: "Medulla spinalis",
    system: "nervous",
    model: hra("spinal_cord"),
    tissue: "neural",
    accent: "#c9a6d9",
    summary:
      "A long cylinder of nervous tissue running from the brainstem down the vertebral canal. It carries signals between the brain and the body and handles reflexes on its own.",
    role: "Conducts sensory and motor signals and coordinates spinal reflexes.",
    modelScope: "The model shows the cord divided into its 31 segments. Spinal nerves and meninges are not included.",
    facts: [
      { label: "Length", value: "About 42 to 45 cm in adults", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Segments", value: "8 cervical, 12 thoracic, 5 lumbar, 5 sacral, 1 coccygeal" },
      { label: "Lower end", value: "Ends around the first or second lumbar vertebra" },
      { label: "Protection", value: "Vertebrae, meninges, and cerebrospinal fluid" },
    ],
    functions: [
      "Carries ascending sensory information toward the brain",
      "Carries descending motor commands to muscles and glands",
      "Completes reflex arcs, such as the knee jerk, without waiting for the brain",
    ],
    terms: [
      { term: "Segment", meaning: "A region of the cord that gives rise to one pair of spinal nerves." },
      { term: "Grey matter", meaning: "The butterfly-shaped core containing nerve cell bodies." },
      { term: "White matter", meaning: "The outer region of myelinated fibre tracts." },
      { term: "Reflex arc", meaning: "The short neural pathway that produces a rapid automatic response." },
      { term: "Cervical", meaning: "Relating to the neck." },
      { term: "Lumbar", meaning: "Relating to the lower back." },
    ],
    hotspots: [
      { id: "cervical", name: "Cervical segment C4", detail: "Cervical segments supply the neck, diaphragm, and arms.", mesh: "VH_M_C4_segment_of_cervical_spinal_cord" },
      { id: "thoracic", name: "Thoracic segment T6", detail: "Thoracic segments supply the chest and abdominal wall.", mesh: "VH_M_sixth_thoracic_spinal_cord_segment" },
      { id: "lumbar", name: "Lumbar segment L3", detail: "Lumbar segments supply the front of the legs.", mesh: "VH_M_third_lumbar_spinal_cord_segment" },
      { id: "sacral", name: "Sacral segment S2", detail: "Sacral segments supply the pelvis and the back of the legs.", mesh: "VH_M_second_sacral_spinal_cord_segment" },
    ],
    quiz: {
      question: "How many pairs of spinal nerves arise from the spinal cord?",
      options: ["12", "24", "31", "43"],
      answer: 2,
      explanation: "There are 31 pairs of spinal nerves, one for each cord segment.",
    },
  },
  {
    id: "eye",
    name: "Eye",
    latin: "Bulbus oculi",
    system: "sensory",
    model: hra("eye"),
    tissue: "eye",
    accent: "#8fc4e8",
    summary:
      "A fluid-filled sphere that focuses light onto the retina. The cornea and lens bend light, the iris controls how much enters, and photoreceptors convert it into nerve signals.",
    role: "Converts patterns of light into signals the brain interprets as vision.",
    modelScope: "This model represents the left eyeball and its internal structures. Eyelids, extraocular muscles, and the optic nerve are not included.",
    facts: [
      { label: "Diameter", value: "About 24 mm", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Layers", value: "Fibrous (sclera, cornea), vascular (choroid, ciliary body, iris), and neural (retina)" },
      { label: "Focusing power", value: "The cornea does most of the bending; the lens fine-tunes focus" },
      { label: "Sharpest vision", value: "At the fovea, in the centre of the macula" },
    ],
    functions: [
      "The cornea and lens refract light to form an image on the retina",
      "The iris adjusts the pupil to control the light entering the eye",
      "Rods and cones in the retina convert light into nerve impulses",
    ],
    terms: [
      { term: "Cornea", meaning: "The clear front window of the eye." },
      { term: "Sclera", meaning: "The tough white outer coat." },
      { term: "Iris", meaning: "The coloured ring of muscle that changes the size of the pupil." },
      { term: "Pupil", meaning: "The opening in the iris that lets light in." },
      { term: "Lens", meaning: "The flexible transparent disc that fine-tunes focus." },
      { term: "Retina", meaning: "The light-sensitive lining at the back of the eye." },
      { term: "Fovea", meaning: "The tiny pit in the retina with the sharpest vision." },
      { term: "Optic disc", meaning: "Where the optic nerve leaves the eye; it has no photoreceptors, so it is the blind spot." },
    ],
    hotspots: [
      { id: "cornea", name: "Cornea", detail: "The transparent front surface that does most of the eye's focusing.", mesh: "VH_M_cornea_L" },
      { id: "lens", name: "Lens", detail: "Changes shape to focus on near or far objects.", mesh: "VH_M_lens_L" },
      { id: "iris", name: "Iris", detail: "Smooth muscle that widens or narrows the pupil.", mesh: "VH_M_iris_L" },
      { id: "retina", name: "Retina", detail: "Contains the rods and cones that detect light.", mesh: "VH_M_retina_L" },
      { id: "optic-disc", name: "Optic disc", detail: "The exit point of the optic nerve and the blind spot.", mesh: "VH_M_optic_disc_L" },
    ],
    quiz: {
      question: "Which structure contains the photoreceptors that detect light?",
      options: ["Cornea", "Iris", "Retina", "Sclera"],
      answer: 2,
      explanation: "The retina is the neural layer at the back of the eye containing rods and cones.",
    },
  },
  {
    id: "lungs",
    name: "Lungs",
    latin: "Pulmones",
    system: "respiratory",
    model: hra("lungs"),
    tissue: "lung",
    accent: "#ef9f9b",
    summary:
      "Paired spongy organs in the thorax that exchange oxygen and carbon dioxide between alveoli and capillaries. The model shows the bronchopulmonary segments and the branching bronchial tree inside them.",
    role: "Supplies oxygen for cellular metabolism and removes carbon dioxide.",
    facts: [
      { label: "Lobes", value: "Three on the right, two on the left", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Location", value: "In the thorax, on either side of the heart" },
      { label: "Exchange unit", value: "Alveoli, around 300 million in total" },
      { label: "Main muscle", value: "Diaphragm, assisted by the intercostal muscles" },
    ],
    functions: [
      "Ventilation moves air into and out of the lungs",
      "The alveolar membrane enables gas diffusion",
      "The respiratory system also contributes to acid-base balance",
    ],
    terms: [
      { term: "Bronchus", meaning: "One of the large air passages that branch from the trachea into the lungs." },
      { term: "Bronchiole", meaning: "A small branch of the bronchial tree with no cartilage in its wall." },
      { term: "Alveolus", meaning: "A tiny air sac where gas exchange happens." },
      { term: "Bronchopulmonary segment", meaning: "A wedge of lung served by its own bronchus and artery." },
      { term: "Hilum", meaning: "The root of the lung where bronchi, vessels, and nerves enter." },
      { term: "Pleura", meaning: "The thin double membrane that surrounds each lung." },
      { term: "Apex", meaning: "The pointed top of the lung, rising just above the first rib." },
    ],
    hotspots: [
      { id: "right-apex", name: "Right apical segment", detail: "The top of the right upper lobe, reaching above the first rib.", mesh: "VH_M_right_apical_bronchopulmonary_segment" },
      { id: "right-hilum", name: "Right hilum", detail: "Where the right main bronchus and pulmonary vessels enter the lung.", mesh: "VH_M_hilum_R" },
      { id: "lingula", name: "Left lingula", detail: "The tongue-shaped part of the left upper lobe that lies next to the heart.", mesh: "VH_M_left_lingula_superior_bronchopulmonary_segment" },
      { id: "basal", name: "Left posterior basal segment", detail: "One of the lower lobe segments resting on the diaphragm.", mesh: "VH_M_left_posetrior_basal_bronchopulmonary_segment" },
      { id: "bronchus", name: "Right superior lobar bronchus", detail: "The bronchus that ventilates the right upper lobe.", mesh: "VH_M_right_superior_lobar_bronchus" },
    ],
    quiz: {
      question: "Where does most oxygen and carbon dioxide exchange occur?",
      options: ["Trachea", "Alveoli", "Pleura", "Larynx"],
      answer: 1,
      explanation: "Thin alveolar walls lie next to capillaries, enabling rapid gas diffusion.",
    },
  },
  {
    id: "larynx",
    name: "Larynx",
    latin: "Larynx",
    system: "respiratory",
    model: hra("larynx"),
    tissue: "cartilage",
    accent: "#bcd3dd",
    summary:
      "The voice box: a framework of cartilages at the top of the trachea that guards the airway during swallowing and houses the vocal folds that produce sound.",
    role: "Protects the airway and produces the voice.",
    modelScope: "The model shows the laryngeal cartilages. Vocal folds, ligaments, and muscles are not included.",
    facts: [
      { label: "Location", value: "In the front of the neck, at the level of the C3 to C6 vertebrae", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Largest cartilage", value: "Thyroid cartilage, which forms the Adam's apple" },
      { label: "Only complete ring", value: "Cricoid cartilage" },
      { label: "Swallowing guard", value: "The epiglottis folds down over the airway" },
    ],
    functions: [
      "Keeps food out of the airway during swallowing",
      "Vibrating vocal folds produce sound for speech",
      "Closing the glottis lets us hold breath and cough forcefully",
    ],
    terms: [
      { term: "Cartilage", meaning: "Firm, flexible connective tissue that holds the airway open." },
      { term: "Epiglottis", meaning: "The leaf-shaped flap that closes the airway when you swallow." },
      { term: "Glottis", meaning: "The opening between the vocal folds." },
      { term: "Vocal folds", meaning: "The two bands of tissue that vibrate to make sound." },
      { term: "Thyroid cartilage", meaning: "The large shield-shaped cartilage at the front of the larynx." },
      { term: "Arytenoid", meaning: "One of two small pyramid-shaped cartilages that move the vocal folds." },
    ],
    hotspots: [
      { id: "thyroid", name: "Thyroid cartilage", detail: "The largest cartilage, forming the prominence known as the Adam's apple.", mesh: "VH_M_thyroid_cartilage" },
      { id: "epiglottis", name: "Epiglottic cartilage", detail: "The flexible flap that tips backward to cover the airway during swallowing.", mesh: "VH_M_epiglottic_cartilage" },
      { id: "cricoid", name: "Cricoid cartilage", detail: "The only complete ring of cartilage in the airway.", mesh: "VH_M_cricoid_cartilage" },
      { id: "arytenoid", name: "Arytenoid cartilage", detail: "Pivots to open and close the vocal folds.", mesh: "VH_M_arytenoid_cartilage_L" },
    ],
    quiz: {
      question: "Which structure closes over the airway during swallowing?",
      options: ["Cricoid cartilage", "Epiglottis", "Thyroid cartilage", "Carina"],
      answer: 1,
      explanation: "The epiglottis folds down to divert food and drink into the oesophagus.",
    },
  },
  {
    id: "trachea",
    name: "Trachea",
    latin: "Trachea",
    system: "respiratory",
    model: hra("trachea"),
    tissue: "mucosa",
    accent: "#e6b8b0",
    summary:
      "The windpipe: a tube about 11 cm long held open by C-shaped rings of cartilage, lined with cilia and mucus that trap and sweep out dust.",
    role: "Carries air between the larynx and the bronchi while cleaning and warming it.",
    facts: [
      { label: "Length", value: "About 10 to 12 cm", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Support", value: "16 to 20 C-shaped cartilage rings" },
      { label: "Lining", value: "Ciliated epithelium with mucus-producing goblet cells" },
      { label: "Ends at", value: "The carina, where it splits into the two main bronchi" },
    ],
    functions: [
      "Provides an open airway that does not collapse when you breathe in",
      "Cilia sweep trapped particles up toward the throat",
      "The soft back wall lets the oesophagus expand during swallowing",
    ],
    terms: [
      { term: "Cartilage ring", meaning: "A C-shaped hoop that keeps the tube from collapsing." },
      { term: "Carina", meaning: "The ridge at the bottom of the trachea where it divides." },
      { term: "Cilia", meaning: "Tiny hair-like projections that beat to move mucus upward." },
      { term: "Mucosa", meaning: "The moist inner lining of a tube or cavity." },
      { term: "Trachealis", meaning: "The smooth muscle joining the open ends of the C rings at the back." },
    ],
    hotspots: [
      { id: "rings", name: "Tracheal cartilage", detail: "C-shaped hyaline cartilage rings with the gap facing the oesophagus.", mesh: "VH_M_tracheal_cartilage" },
      { id: "lumen", name: "Tracheal wall", detail: "The mucosa-lined tube through which air passes.", mesh: "VH_M_trachea" },
      { id: "carina", name: "Carina", detail: "The sensitive ridge where the trachea divides into left and right main bronchi.", mesh: "VH_M_carina" },
    ],
    quiz: {
      question: "Why are the tracheal cartilages C-shaped rather than complete rings?",
      options: ["To allow the trachea to stretch lengthwise", "So the oesophagus behind can expand during swallowing", "To reduce weight", "To let air escape"],
      answer: 1,
      explanation: "The open part of the C faces the oesophagus so a swallowed bolus can bulge into the space.",
    },
  },
  {
    id: "bronchi",
    name: "Main bronchi",
    latin: "Bronchi principales",
    system: "respiratory",
    model: hra("bronchi"),
    tissue: "mucosa",
    accent: "#e2b7ad",
    summary:
      "The two large airways that branch from the trachea at the carina. The right main bronchus is wider, shorter, and more vertical than the left.",
    role: "Conducts air from the trachea into each lung.",
    facts: [
      { label: "Right bronchus", value: "Wider, shorter, and more vertical, so inhaled objects lodge here more often", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Left bronchus", value: "Longer and more horizontal, passing under the aortic arch" },
      { label: "Support", value: "Cartilage plates rather than complete rings" },
      { label: "Next branches", value: "Lobar bronchi, then segmental bronchi" },
    ],
    functions: [
      "Deliver air to the right and left lungs",
      "Cartilage keeps the airway open during forceful breathing",
      "Smooth muscle in the wall adjusts airway diameter",
    ],
    terms: [
      { term: "Bronchus", meaning: "A large airway with cartilage in its wall." },
      { term: "Lobar bronchus", meaning: "A branch supplying one lobe of a lung." },
      { term: "Segmental bronchus", meaning: "A branch supplying one bronchopulmonary segment." },
      { term: "Bronchial cartilage", meaning: "Irregular plates of cartilage embedded in the airway wall." },
    ],
    hotspots: [
      { id: "right", name: "Right main bronchus", detail: "Shorter and steeper, it is the more common site for inhaled foreign objects.", mesh: "VH_M_right_main_bronchus" },
      { id: "left", name: "Left main bronchus", detail: "Longer and more horizontal, it passes beneath the aortic arch.", mesh: "VH_M_left_main_bronchus" },
      { id: "cartilage", name: "Bronchial cartilage", detail: "Plates of cartilage that hold the bronchus open.", mesh: "VH_M_cartilage_of_the_main_bronchus_R" },
    ],
    quiz: {
      question: "An inhaled peanut is most likely to lodge in which airway?",
      options: ["Left main bronchus", "Right main bronchus", "Trachea", "Larynx"],
      answer: 1,
      explanation: "The right main bronchus is wider, shorter, and more vertical, so objects tend to fall into it.",
    },
  },
  {
    id: "mouth",
    name: "Mouth and salivary glands",
    latin: "Cavitas oris",
    system: "digestive",
    model: hra("mouth"),
    tissue: "mucosa",
    accent: "#e79a8e",
    summary:
      "The start of the digestive tract, where teeth cut and grind food, the tongue mixes it, and three pairs of salivary glands begin the chemical digestion of starch.",
    role: "Begins mechanical and chemical digestion and prepares food for swallowing.",
    modelScope: "The model includes the tongue, teeth, palate, mandible, and the parotid, submandibular, and sublingual glands. Lips and cheeks are not included.",
    facts: [
      { label: "Adult teeth", value: "32: incisors, canines, premolars, and molars", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Saliva", value: "About 1 to 1.5 litres a day, containing salivary amylase" },
      { label: "Largest gland", value: "Parotid gland, in front of each ear" },
      { label: "Taste", value: "Taste buds sit mostly on the papillae of the tongue" },
    ],
    functions: [
      "Teeth break food into smaller pieces to increase its surface area",
      "Salivary amylase starts breaking starch down into sugars",
      "The tongue shapes the food into a bolus and pushes it back to be swallowed",
    ],
    terms: [
      { term: "Bolus", meaning: "The soft ball of chewed food that is swallowed." },
      { term: "Amylase", meaning: "The enzyme in saliva that begins starch digestion." },
      { term: "Papillae", meaning: "Small bumps on the tongue that carry taste buds." },
      { term: "Palate", meaning: "The roof of the mouth: bony hard palate in front, soft palate behind." },
      { term: "Mandible", meaning: "The lower jaw bone." },
      { term: "Gingiva", meaning: "The gums." },
      { term: "Parotid", meaning: "The large salivary gland in front of the ear." },
    ],
    hotspots: [
      { id: "tongue", name: "Dorsal tongue", detail: "The upper surface of the tongue, covered in papillae with taste buds.", mesh: "VH_M_dorsal_tongue" },
      { id: "teeth", name: "Upper teeth", detail: "Incisors cut, canines tear, and premolars and molars grind.", mesh: "VH_M_set_of_upper_jaw_teeth" },
      { id: "parotid", name: "Parotid gland", detail: "The largest salivary gland, producing watery, enzyme-rich saliva.", mesh: "VH_M_parotid_gland_R" },
      { id: "submandibular", name: "Submandibular gland", detail: "Produces most of the saliva at rest.", mesh: "VH_M_submandibular_gland_L" },
      { id: "palate", name: "Hard palate", detail: "The bony roof of the mouth that the tongue presses food against.", mesh: "VH_M_hard_palate" },
      { id: "mandible", name: "Mandible", detail: "The lower jaw, the only freely moving bone of the skull.", mesh: "VH_M_mandible" },
    ],
    quiz: {
      question: "Which nutrient does salivary amylase begin to digest?",
      options: ["Protein", "Fat", "Starch", "Vitamins"],
      answer: 2,
      explanation: "Amylase breaks starch into shorter sugar chains, which is why bread tastes sweet if chewed for long.",
    },
  },
  {
    id: "stomach",
    name: "Stomach",
    latin: "Gaster",
    system: "digestive",
    model: bp3d("stomach"),
    modelSource: "bp3d",
    tissue: "mucosa",
    accent: "#e08a6a",
    summary:
      "A J-shaped muscular bag between the oesophagus and the duodenum that stores food, churns it with acid and enzymes, and releases the resulting chyme in small portions into the small intestine.",
    role: "Stores and mixes food and begins protein digestion.",
    modelScope: "The model shows the stomach with the lower oesophagus above it and the duodenum leaving it, from the BodyParts3D reference body.",
    facts: [
      { label: "Capacity", value: "About 1 to 1.5 litres when full, much less when empty", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Location", value: "Left upper abdomen, under the diaphragm" },
      { label: "Regions", value: "Cardia, fundus, body, and pylorus" },
      { label: "Acid", value: "Gastric juice is about pH 1.5 to 3.5" },
    ],
    functions: [
      "Muscular churning mixes food into chyme",
      "Hydrochloric acid kills microbes and activates pepsin, which begins protein digestion",
      "The pyloric sphincter releases chyme into the duodenum a little at a time",
    ],
    terms: [
      { term: "Cardia", meaning: "The opening where the oesophagus joins the stomach." },
      { term: "Fundus", meaning: "The dome-shaped top of the stomach that rises above the cardia." },
      { term: "Body", meaning: "The large central part of the stomach." },
      { term: "Pylorus", meaning: "The narrow lower end that leads into the duodenum." },
      { term: "Sphincter", meaning: "A ring of muscle that closes an opening, such as the pyloric sphincter." },
      { term: "Rugae", meaning: "The folds of the stomach lining that flatten as it fills." },
      { term: "Chyme", meaning: "The semi-liquid mixture of food and gastric juice." },
      { term: "Pepsin", meaning: "The enzyme that begins breaking proteins into smaller pieces." },
    ],
    hotspots: [
      { id: "stomach", name: "Stomach", detail: "The J-shaped bag where food is stored and churned with gastric juice.", mesh: "BP3D_Stomach" },
      { id: "oesophagus", name: "Oesophagus", detail: "The muscular tube that carries swallowed food down to the cardia.", mesh: "BP3D_Esophagus" },
      { id: "duodenum", name: "Duodenum", detail: "The first part of the small intestine, which receives chyme through the pylorus.", mesh: "BP3D_Duodenum" },
    ],
    quiz: {
      question: "Which enzyme begins protein digestion in the stomach?",
      options: ["Amylase", "Lipase", "Pepsin", "Bile"],
      answer: 2,
      explanation: "Pepsin, activated by hydrochloric acid, starts breaking proteins into smaller peptides.",
    },
  },
  {
    id: "liver",
    name: "Liver",
    latin: "Hepar",
    system: "digestive",
    model: hra("liver"),
    tissue: "liver",
    accent: "#bc6d5e",
    summary:
      "The largest solid organ, involved in nutrient metabolism, detoxification, bile production, protein synthesis, and energy storage. The model shows its segments, surfaces, and ligaments.",
    role: "Processes nutrients arriving from the digestive tract and maintains many metabolic balances.",
    facts: [
      { label: "Weight", value: "About 1.4 to 1.6 kg in adults", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Location", value: "Right upper abdomen, below the diaphragm" },
      { label: "Dual blood supply", value: "Hepatic artery and hepatic portal vein" },
      { label: "Secretion", value: "Bile, up to a litre a day" },
    ],
    functions: [
      "Regulates carbohydrate, lipid, and amino acid metabolism",
      "Synthesises albumin and many clotting factors",
      "Transforms and clears many foreign and endogenous substances",
    ],
    terms: [
      { term: "Lobe", meaning: "A major division of the liver: right, left, caudate, and quadrate." },
      { term: "Segment", meaning: "One of eight functional units, each with its own blood supply and bile drainage." },
      { term: "Porta hepatis", meaning: "The gateway where vessels and bile ducts enter and leave." },
      { term: "Falciform ligament", meaning: "The fold of peritoneum that separates the right and left lobes and ties the liver to the abdominal wall." },
      { term: "Bile", meaning: "A greenish fluid that emulsifies fats in the small intestine." },
      { term: "Glycogen", meaning: "The stored form of glucose kept in liver cells." },
      { term: "Bare area", meaning: "The part of the liver surface in direct contact with the diaphragm, with no peritoneum." },
    ],
    hotspots: [
      { id: "right-lobe", name: "Right lobe", detail: "The largest lobe of the liver, here shown as its anterosuperior segment.", mesh: "VH_M_right_anterosuperior_segment" },
      { id: "left-lobe", name: "Left lobe", detail: "Extends across the midline of the body, here shown as its anterolateral segment.", mesh: "VH_M_left_anterolateral_segment" },
      { id: "porta", name: "Porta hepatis", detail: "The region where vessels, ducts, and nerves enter or leave the liver.", mesh: "VH_M_porta_hepatis" },
      { id: "falciform", name: "Falciform ligament", detail: "The peritoneal fold marking the boundary between the right and left lobes.", mesh: "VH_M_falciform_ligament" },
      { id: "caudate", name: "Caudate lobe", detail: "A small lobe on the back of the liver next to the inferior vena cava.", mesh: "VH_M_caudate_lobe_of_liver" },
    ],
    quiz: {
      question: "Which digestive secretion is produced by the liver?",
      options: ["Insulin", "Bile", "Gastric acid", "Saliva"],
      answer: 1,
      explanation: "Hepatocytes produce bile, which is stored in the gallbladder and released into the duodenum to emulsify fats.",
    },
  },
  {
    id: "gallbladder",
    name: "Gallbladder",
    latin: "Vesica biliaris",
    system: "digestive",
    model: hra("gallbladder"),
    tissue: "mucosa",
    accent: "#8fb06c",
    summary:
      "A small pear-shaped sac tucked under the liver that stores and concentrates bile between meals, then squeezes it into the duodenum when fatty food arrives.",
    role: "Stores and concentrates bile and releases it on demand.",
    facts: [
      { label: "Capacity", value: "About 30 to 50 mL", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Location", value: "In a fossa on the underside of the right lobe of the liver" },
      { label: "Duct", value: "The cystic duct joins the common hepatic duct to form the common bile duct" },
      { label: "Trigger", value: "The hormone cholecystokinin makes it contract" },
    ],
    functions: [
      "Concentrates bile by absorbing water and salts",
      "Contracts after fatty meals to release bile",
      "Bile emulsifies fats so lipase can digest them",
    ],
    terms: [
      { term: "Fundus", meaning: "The broad rounded bottom of a hollow organ." },
      { term: "Body", meaning: "The main central part of the organ." },
      { term: "Neck", meaning: "The narrow part that leads into the duct." },
      { term: "Cystic duct", meaning: "The short tube that connects the gallbladder to the bile duct." },
      { term: "Emulsify", meaning: "To break fat into tiny droplets that mix with water." },
    ],
    hotspots: [
      { id: "fundus", name: "Fundus", detail: "The broad rounded end of the gallbladder that peeks below the liver edge.", position: [0, -0.56, 0.18] },
      { id: "body", name: "Body", detail: "The main region that stores and concentrates bile.", position: [0.08, 0.02, 0.24] },
      { id: "neck", name: "Neck", detail: "Narrows and continues into the cystic duct.", position: [-0.06, 0.58, 0.14] },
    ],
    quiz: {
      question: "What does the gallbladder store?",
      options: ["Urine", "Bile", "Pancreatic juice", "Lymph"],
      answer: 1,
      explanation: "Bile made in the liver is stored and concentrated in the gallbladder until it is needed.",
    },
  },
  {
    id: "pancreas",
    name: "Pancreas",
    latin: "Pancreas",
    system: "endocrine",
    model: hra("pancreas"),
    tissue: "gland",
    accent: "#e4c27f",
    summary:
      "A soft, elongated gland behind the stomach with two jobs: its exocrine tissue pours digestive enzymes into the duodenum, and its islets release insulin and glucagon into the blood.",
    role: "Digests food chemically and regulates blood glucose.",
    facts: [
      { label: "Length", value: "About 12 to 15 cm", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Parts", value: "Head, neck, body, tail, and uncinate process" },
      { label: "Exocrine product", value: "Pancreatic juice with amylase, lipase, and proteases" },
      { label: "Endocrine product", value: "Insulin and glucagon from the islets of Langerhans" },
    ],
    functions: [
      "Enzymes digest starch, fats, and proteins in the small intestine",
      "Bicarbonate neutralises acid arriving from the stomach",
      "Insulin lowers and glucagon raises blood glucose",
    ],
    terms: [
      { term: "Exocrine", meaning: "Secreting through a duct onto a surface or into a cavity." },
      { term: "Endocrine", meaning: "Secreting hormones directly into the blood." },
      { term: "Islet", meaning: "A cluster of hormone-producing cells scattered through the gland." },
      { term: "Head", meaning: "The widest part, cradled by the curve of the duodenum." },
      { term: "Tail", meaning: "The narrow end that reaches the spleen." },
      { term: "Uncinate process", meaning: "A hook-shaped extension of the head that tucks behind vessels." },
    ],
    hotspots: [
      { id: "head", name: "Head", detail: "Sits in the C-shaped curve of the duodenum.", mesh: "VH_M_head_of_pancreas" },
      { id: "body", name: "Body", detail: "Crosses the abdomen behind the stomach.", mesh: "VH_M_body_of_pancreas" },
      { id: "tail", name: "Tail", detail: "Reaches the hilum of the spleen.", mesh: "VH_M_tail_of_pancreas" },
      { id: "uncinate", name: "Uncinate process", detail: "A hook of tissue that curls behind the superior mesenteric vessels.", mesh: "VH_M_uncinate_process_of_the_pancreas" },
    ],
    quiz: {
      question: "Which hormone from the pancreas lowers blood glucose?",
      options: ["Glucagon", "Insulin", "Amylase", "Bile"],
      answer: 1,
      explanation: "Insulin lets cells take up glucose and the liver store it as glycogen.",
    },
  },
  {
    id: "small_intestine",
    name: "Small intestine",
    latin: "Intestinum tenue",
    system: "digestive",
    model: hra("small_intestine"),
    tissue: "mucosa",
    accent: "#f0a79b",
    summary:
      "A coiled tube about six metres long where most chemical digestion and almost all absorption happen. It runs from the stomach through the duodenum, jejunum, and ileum to the large intestine.",
    role: "Completes digestion and absorbs nutrients into the blood and lymph.",
    facts: [
      { label: "Length", value: "About 6 m in a relaxed adult", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Parts", value: "Duodenum (25 cm), jejunum (2.5 m), ileum (3.5 m)" },
      { label: "Surface area", value: "Folds, villi, and microvilli give roughly 250 square metres" },
      { label: "Inputs", value: "Bile and pancreatic juice enter the duodenum" },
    ],
    functions: [
      "Enzymes from the pancreas and the intestinal wall finish digestion",
      "Villi absorb sugars, amino acids, fats, vitamins, and water",
      "Peristalsis moves chyme along the tube",
    ],
    terms: [
      { term: "Duodenum", meaning: "The first, C-shaped part that receives bile and pancreatic juice." },
      { term: "Jejunum", meaning: "The middle section where most absorption takes place." },
      { term: "Ileum", meaning: "The last section, which absorbs vitamin B12 and bile salts." },
      { term: "Villus", meaning: "A finger-like projection of the lining that increases surface area." },
      { term: "Peristalsis", meaning: "Waves of muscle contraction that push contents along." },
      { term: "Chyme", meaning: "The semi-liquid mixture of food and digestive juices." },
      { term: "Ampulla", meaning: "A widened chamber where the bile and pancreatic ducts meet." },
    ],
    hotspots: [
      { id: "duodenum", name: "Superior duodenum", detail: "The first part of the small intestine, leaving the stomach.", mesh: "VH_M_duodenum_superior" },
      { id: "ampulla", name: "Hepatopancreatic ampulla", detail: "Where bile and pancreatic juice empty into the duodenum.", mesh: "VH_M_duodenal_ampulla" },
      { id: "jejunum", name: "Jejunum", detail: "Thick-walled and rich in folds, this is where most absorption happens.", mesh: "VH_M_jejunum" },
      { id: "ileum", name: "Ileum", detail: "The final section, ending at the ileocaecal valve.", mesh: "VH_M_ileum" },
    ],
    quiz: {
      question: "Which section of the small intestine receives bile and pancreatic juice?",
      options: ["Jejunum", "Ileum", "Duodenum", "Caecum"],
      answer: 2,
      explanation: "Both ducts open into the duodenum at the hepatopancreatic ampulla.",
    },
  },
  {
    id: "intestine",
    name: "Large intestine",
    latin: "Intestinum crassum",
    system: "digestive",
    model: hra("intestine"),
    tissue: "mucosa",
    accent: "#e8a37a",
    summary:
      "A wide tube about 1.5 metres long that frames the abdomen. It absorbs water and salts from indigestible residue, hosts gut bacteria, and stores faeces until they are expelled.",
    role: "Recovers water and electrolytes and forms and stores faeces.",
    facts: [
      { label: "Length", value: "About 1.5 m", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Parts", value: "Caecum, ascending, transverse, descending, and sigmoid colon, rectum" },
      { label: "Bacteria", value: "Trillions of microbes that make vitamin K and some B vitamins" },
      { label: "Appendix", value: "A small blind pouch off the caecum, rich in lymphoid tissue" },
    ],
    functions: [
      "Absorbs water, sodium, and other electrolytes",
      "Bacteria ferment fibre and produce vitamins",
      "Compacts and stores waste before defecation",
    ],
    terms: [
      { term: "Caecum", meaning: "The pouch at the start of the large intestine where the ileum joins." },
      { term: "Colon", meaning: "The main length of the large intestine." },
      { term: "Flexure", meaning: "A sharp bend, such as the hepatic flexure under the liver." },
      { term: "Sigmoid", meaning: "S-shaped, describing the last curve of the colon." },
      { term: "Rectum", meaning: "The final straight section that stores faeces." },
      { term: "Ileocaecal valve", meaning: "The valve that stops contents flowing back into the ileum." },
      { term: "Vermiform appendix", meaning: "The worm-shaped pouch hanging from the caecum." },
    ],
    hotspots: [
      { id: "caecum", name: "Caecum", detail: "The blind pouch that receives chyme from the ileum.", mesh: "VH_M_caecum" },
      { id: "appendix", name: "Vermiform appendix", detail: "A narrow pouch off the caecum containing lymphoid tissue.", mesh: "VH_M_vermiform_appendix" },
      { id: "transverse", name: "Transverse colon", detail: "Crosses the abdomen below the stomach.", mesh: "VH_M_transverse_colon" },
      { id: "sigmoid", name: "Sigmoid colon", detail: "The S-shaped final loop before the rectum.", mesh: "VH_M_sigmoid_colon" },
      { id: "rectum", name: "Rectum", detail: "Stores faeces until they leave through the anal canal.", mesh: "VH_M_rectum" },
    ],
    quiz: {
      question: "What is the main substance absorbed by the large intestine?",
      options: ["Glucose", "Amino acids", "Water", "Fatty acids"],
      answer: 2,
      explanation: "The large intestine reclaims water and salts from the residue left after the small intestine.",
    },
  },
  {
    id: "spleen",
    name: "Spleen",
    latin: "Splen",
    system: "lymphatic",
    model: hra("spleen"),
    tissue: "lymphoid",
    accent: "#a95d68",
    summary:
      "A soft, purplish organ in the upper left abdomen that filters blood, recycles old red cells, and mounts immune responses to blood-borne germs.",
    role: "Filters blood and supports immune defence.",
    facts: [
      { label: "Weight", value: "About 150 g", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Location", value: "Left upper abdomen, behind the stomach and under the ribs" },
      { label: "Tissue types", value: "Red pulp filters blood; white pulp holds lymphocytes" },
      { label: "Reserve", value: "Stores platelets and can release blood in an emergency" },
    ],
    functions: [
      "Removes worn-out red blood cells and recycles their iron",
      "White pulp lymphocytes respond to antigens in the blood",
      "Acts as a reservoir for blood and platelets",
    ],
    terms: [
      { term: "Red pulp", meaning: "Blood-filled tissue that filters and destroys old red cells." },
      { term: "White pulp", meaning: "Lymphoid tissue clustered around arteries that fights infection." },
      { term: "Hilum", meaning: "The notch where vessels enter and leave the organ." },
      { term: "Diaphragmatic surface", meaning: "The smooth convex face that rests against the diaphragm." },
      { term: "Visceral surface", meaning: "The face that touches the stomach, kidney, and colon." },
    ],
    hotspots: [
      { id: "hilum", name: "Hilum of spleen", detail: "Where the splenic artery and vein enter and leave.", mesh: "VH_M_hilum_of_spleen" },
      { id: "diaphragmatic", name: "Diaphragmatic surface", detail: "The smooth convex surface that faces the diaphragm and ribs.", mesh: "VH_M_diaphragmatic_surface_of_spleen" },
      { id: "gastric", name: "Gastric surface", detail: "The concave face that rests against the stomach.", mesh: "VH_M_gastric_surface_of_spleen" },
      { id: "renal", name: "Renal surface", detail: "The face that lies against the left kidney.", mesh: "VH_M_renal_surface_of_spleen" },
    ],
    quiz: {
      question: "Which cells does the spleen remove from circulation?",
      options: ["Old red blood cells", "New white blood cells", "Bone cells", "Nerve cells"],
      answer: 0,
      explanation: "Macrophages in the red pulp break down aged red cells and recycle their iron.",
    },
  },
  {
    id: "thymus",
    name: "Thymus",
    latin: "Thymus",
    system: "lymphatic",
    model: hra("thymus"),
    tissue: "lymphoid",
    accent: "#d3b887",
    summary:
      "A two-lobed primary lymphoid organ behind the sternum and above the heart. It provides the environment in which immature T cells develop, are tested, and learn to tolerate the body's own tissues.",
    role: "Produces mature T cells that recognise foreign antigens without attacking the body's own tissues.",
    facts: [
      { label: "Location", value: "Anterior superior mediastinum, behind the sternum", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Shape", value: "Two lobes joined by connective tissue" },
      { label: "Microscopic regions", value: "Cortex and medulla" },
      { label: "Age change", value: "Largest in childhood; shrinks and fills with fat after puberty" },
    ],
    functions: [
      "Supports maturation of T cell precursors arriving from bone marrow",
      "Positive selection keeps cells that recognise the body's own MHC molecules",
      "Negative selection removes cells that react strongly to self antigens",
    ],
    terms: [
      { term: "T cell", meaning: "A lymphocyte that matures in the thymus and coordinates immune responses." },
      { term: "Lobe", meaning: "One of the two halves of the gland." },
      { term: "Cortex", meaning: "The outer layer, packed with developing T cells." },
      { term: "Medulla", meaning: "The inner region where the final selection happens." },
      { term: "Involution", meaning: "The gradual shrinking of the thymus with age." },
      { term: "Self tolerance", meaning: "The immune system's ability to leave the body's own cells alone." },
    ],
    hotspots: [
      { id: "left", name: "Left lobe", detail: "One of the two thymic lobes, built from many lobules with cortex and medulla.", mesh: "VH_M_thymus_lobe_L" },
      { id: "right", name: "Right lobe", detail: "The right lobe lies beside the left, just above the pericardium.", mesh: "VH_M_thymus_lobe_R" },
    ],
    quiz: {
      question: "Where do immature T cells undergo selection and maturation?",
      options: ["Thymus", "Gallbladder", "Pancreas", "Kidney"],
      answer: 0,
      explanation: "The thymic cortex and medulla provide the environment required for T cell development and selection.",
    },
  },
  {
    id: "lymph_node",
    name: "Lymph node",
    latin: "Nodus lymphaticus",
    system: "lymphatic",
    model: hra("lymph_node"),
    tissue: "lymphoid",
    accent: "#c8b86a",
    summary:
      "A small bean-shaped filter along the lymphatic vessels. Lymph enters through several afferent vessels, is scanned by lymphocytes and macrophages, and leaves through one efferent vessel at the hilum.",
    role: "Filters lymph and launches immune responses against trapped germs.",
    modelScope: "The model is a single enlarged reference node with its afferent and efferent vessels and internal regions.",
    facts: [
      { label: "Number", value: "Roughly 600 nodes across the body", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Size", value: "Usually 1 to 2 cm, swelling during infection" },
      { label: "Regions", value: "Cortex with follicles, paracortex, and medulla" },
      { label: "Clusters", value: "Neck, armpits, groin, and along the gut" },
    ],
    functions: [
      "Traps bacteria, viruses, and cancer cells carried in lymph",
      "B cells in follicles multiply and make antibodies",
      "T cells in the paracortex are activated by antigen-presenting cells",
    ],
    terms: [
      { term: "Lymph", meaning: "The clear fluid that drains from tissues into lymphatic vessels." },
      { term: "Afferent", meaning: "Carrying toward: afferent vessels bring lymph into the node." },
      { term: "Efferent", meaning: "Carrying away: the efferent vessel leaves at the hilum." },
      { term: "Follicle", meaning: "A rounded cluster of B cells in the cortex." },
      { term: "Paracortex", meaning: "The T-cell rich zone between cortex and medulla." },
      { term: "Capsule", meaning: "The tough outer coat of connective tissue." },
    ],
    hotspots: [
      { id: "capsule", name: "Capsule", detail: "The fibrous coat that sends partitions into the node.", mesh: "Yao_capsule_of_lymph_node" },
      { id: "follicles", name: "Follicles", detail: "Cortical clusters where B cells multiply during an infection.", mesh: "Yao_follicles" },
      { id: "paracortex", name: "Paracortex", detail: "The T cell zone where immune responses are coordinated.", mesh: "Yao_paracortex" },
      { id: "medulla", name: "Medulla", detail: "Cords of plasma cells and macrophages near the exit.", mesh: "Yao_medulla_of_lymph_node" },
      { id: "afferent", name: "Afferent lymphatic vessel", detail: "Brings lymph into the node through the convex side.", mesh: "Yao_afferent_lymphatic_vessel" },
    ],
    quiz: {
      question: "Which cells in a lymph node follicle produce antibodies?",
      options: ["Red blood cells", "B cells", "Platelets", "Osteocytes"],
      answer: 1,
      explanation: "B lymphocytes in the follicles mature into plasma cells that secrete antibodies.",
    },
  },
  {
    id: "tonsil",
    name: "Palatine tonsil",
    latin: "Tonsilla palatina",
    system: "lymphatic",
    model: hra("tonsil"),
    tissue: "lymphoid",
    accent: "#d78a8a",
    summary:
      "A mass of lymphoid tissue on each side of the back of the throat. Its pitted surface samples germs entering through the mouth and nose and helps train the immune system.",
    role: "Guards the entrance to the throat against inhaled and swallowed germs.",
    modelScope: "The model represents the left palatine tonsil only.",
    facts: [
      { label: "Location", value: "Between the arches of the soft palate at the back of the mouth", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Surface", value: "Deep pits called crypts that trap material" },
      { label: "Partners", value: "Together with the adenoids and lingual tonsil they form a protective ring" },
      { label: "Common problem", value: "Tonsillitis, an infection that makes them swell" },
    ],
    functions: [
      "Traps microbes in its crypts so lymphocytes can meet them",
      "Produces antibodies against germs entering by mouth",
      "Most active in early childhood while the immune system is learning",
    ],
    terms: [
      { term: "Crypt", meaning: "A deep pit in the tonsil surface that increases contact with germs." },
      { term: "Lymphoid tissue", meaning: "Tissue rich in lymphocytes." },
      { term: "Palatine", meaning: "Relating to the palate." },
      { term: "Waldeyer's ring", meaning: "The ring of tonsils around the throat entrance." },
    ],
    hotspots: [
      { id: "surface", name: "Tonsillar surface", detail: "The pitted medial surface facing the throat.", position: [0, 0.3, 0.55] },
      { id: "body", name: "Lymphoid body", detail: "Packed with follicles of B cells beneath the surface.", position: [0.1, -0.1, 0.4] },
      { id: "lower", name: "Lower pole", detail: "The lower end near the base of the tongue.", position: [-0.1, -0.62, 0.2] },
    ],
    quiz: {
      question: "Why does the tonsil surface have deep crypts?",
      options: ["To produce saliva", "To trap germs so immune cells can respond", "To anchor the tongue", "To warm inhaled air"],
      answer: 1,
      explanation: "Crypts increase surface area and hold material where lymphocytes can sample it.",
    },
  },
  {
    id: "kidney",
    name: "Kidney",
    latin: "Ren",
    system: "urinary",
    model: hra("kidney"),
    tissue: "kidney",
    accent: "#c8756b",
    summary:
      "A bean-shaped organ that filters the blood, removes wastes and excess water as urine, and balances salts and blood pressure. The model exposes the cortex, pyramids, and columns inside.",
    role: "Filters blood, forms urine, and regulates water, salt, and acid-base balance.",
    modelScope: "This model represents the left kidney only.",
    facts: [
      { label: "Size", value: "About 11 cm long, 6 cm wide, 3 cm thick", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Location", value: "Either side of the spine, behind the peritoneum; the right sits slightly lower" },
      { label: "Working units", value: "About one million nephrons per kidney" },
      { label: "Blood flow", value: "Around a quarter of cardiac output passes through the kidneys" },
    ],
    functions: [
      "Filters plasma in the glomeruli and reabsorbs what the body needs",
      "Regulates blood volume and pressure and secretes erythropoietin",
      "Activates vitamin D and balances electrolytes",
    ],
    terms: [
      { term: "Cortex", meaning: "The outer layer, containing the glomeruli where filtering begins." },
      { term: "Medulla", meaning: "The inner region made of cone-shaped pyramids." },
      { term: "Renal pyramid", meaning: "A cone of collecting tubes that drains urine toward the papilla." },
      { term: "Renal column", meaning: "A strip of cortex that dips between the pyramids." },
      { term: "Papilla", meaning: "The tip of a pyramid where urine drips into a calyx." },
      { term: "Nephron", meaning: "The microscopic filtering unit of the kidney." },
      { term: "Capsule", meaning: "The tough fibrous coat around the kidney." },
      { term: "Hilum", meaning: "The indented edge where the artery, vein, and ureter pass." },
    ],
    hotspots: [
      { id: "capsule", name: "Renal capsule", detail: "The fibrous outer coat protecting the kidney.", mesh: "VH_M_kidney_capsule_L" },
      { id: "cortex", name: "Outer cortex", detail: "Contains the glomeruli and convoluted tubules of the nephrons.", mesh: "VH_M_outer_cortex_of_kidney_L" },
      { id: "pyramid", name: "Renal pyramid", detail: "A cone of collecting ducts that carries urine to the papilla.", mesh: "VH_M_renal_pyramid_L_a" },
      { id: "column", name: "Renal column", detail: "Cortical tissue that extends between the pyramids.", mesh: "VH_M_renal_column_L" },
      { id: "hilum", name: "Hilum", detail: "Where the renal artery, vein, and ureter enter and leave.", mesh: "VH_M_hilum_of_kidney_L" },
    ],
    quiz: {
      question: "What is the functional unit of the kidney?",
      options: ["Alveolus", "Nephron", "Villus", "Neuron"],
      answer: 1,
      explanation: "Each nephron filters blood and forms urine; a kidney contains about a million of them.",
    },
  },
  {
    id: "ureter",
    name: "Renal pelvis and ureter",
    latin: "Pelvis renalis et ureter",
    system: "urinary",
    model: hra("ureter"),
    tissue: "mucosa",
    accent: "#d9a36c",
    summary:
      "The drainage system of the kidney. Urine drips from the pyramids into minor calyces, which merge into major calyces and the funnel-shaped renal pelvis before the ureter carries it down to the bladder.",
    role: "Collects urine from the kidney and conveys it to the bladder.",
    modelScope: "This model represents the left collecting system and ureter only.",
    facts: [
      { label: "Ureter length", value: "About 25 to 30 cm", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Calyces", value: "Several minor calyces join into two or three major calyces" },
      { label: "Movement", value: "Peristaltic waves push urine down even when lying flat" },
      { label: "Common problem", value: "Kidney stones can lodge in the ureter and cause severe pain" },
    ],
    functions: [
      "Calyces cup the papillae and collect urine",
      "The renal pelvis funnels urine into the ureter",
      "Peristalsis moves urine to the bladder in small spurts",
    ],
    terms: [
      { term: "Calyx", meaning: "A cup-shaped chamber that receives urine from a papilla." },
      { term: "Minor calyx", meaning: "A small cup around a single papilla." },
      { term: "Major calyx", meaning: "A larger chamber formed by several minor calyces." },
      { term: "Renal pelvis", meaning: "The funnel that gathers urine before the ureter." },
      { term: "Ureter", meaning: "The muscular tube from kidney to bladder." },
      { term: "Peristalsis", meaning: "Rhythmic waves of muscle contraction that move contents along a tube." },
    ],
    hotspots: [
      { id: "minor", name: "Minor calyx", detail: "A cup that fits over a renal papilla and catches urine.", mesh: "VH_M_minor_calyx_L_a" },
      { id: "major", name: "Major calyx", detail: "Formed where two or three minor calyces merge.", mesh: "VH_M_major_calyx_L_a" },
      { id: "pelvis", name: "Renal pelvis", detail: "The funnel that narrows into the ureter at the hilum.", mesh: "VH_M_renal_pelvis_L" },
      { id: "ureter", name: "Ureter", detail: "The muscular tube that carries urine to the bladder.", mesh: "VH_M_ureter_L" },
    ],
    quiz: {
      question: "In what order does urine pass through the collecting system?",
      options: ["Ureter, pelvis, calyx", "Minor calyx, major calyx, renal pelvis, ureter", "Renal pelvis, calyx, ureter", "Major calyx, minor calyx, ureter"],
      answer: 1,
      explanation: "Urine flows from the papillae into minor calyces, then major calyces, the renal pelvis, and finally the ureter.",
    },
  },
  {
    id: "bladder",
    name: "Urinary bladder",
    latin: "Vesica urinaria",
    system: "urinary",
    model: hra("bladder"),
    tissue: "muscle",
    accent: "#e8c07a",
    summary:
      "A hollow muscular bag in the pelvis that stores urine. Its stretchy wall relaxes as it fills, and when the bladder contracts and the sphincters relax, urine leaves through the urethra.",
    role: "Stores urine and expels it under voluntary control.",
    facts: [
      { label: "Capacity", value: "Comfortable at about 400 to 500 mL", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Wall muscle", value: "Detrusor smooth muscle" },
      { label: "Lining", value: "Transitional epithelium that stretches without tearing" },
      { label: "Trigone", value: "A smooth triangle between the two ureter openings and the urethra" },
    ],
    functions: [
      "Stretch receptors signal fullness to the spinal cord and brain",
      "The detrusor muscle contracts to empty the bladder",
      "Ureter openings act as valves so urine cannot flow back to the kidneys",
    ],
    terms: [
      { term: "Detrusor", meaning: "The smooth muscle of the bladder wall that squeezes urine out." },
      { term: "Trigone", meaning: "The smooth triangular area on the bladder floor." },
      { term: "Fundus", meaning: "The dome-shaped top of the bladder." },
      { term: "Neck", meaning: "The narrow lower part leading into the urethra." },
      { term: "Ureteral orifice", meaning: "The slit-like opening where a ureter enters." },
      { term: "Sphincter", meaning: "A ring of muscle that closes an opening." },
    ],
    hotspots: [
      { id: "dome", name: "Dome of bladder", detail: "The top of the bladder that rises into the abdomen as it fills.", mesh: "VH_M_fundus_of_urinary_bladder_dome" },
      { id: "trigone", name: "Trigone", detail: "The smooth triangle between the ureter openings and the urethra.", mesh: "VH_M_trigone_of_urinary_bladder" },
      { id: "orifice", name: "Ureteral orifice", detail: "Where the left ureter enters the bladder at an angle that acts as a valve.", mesh: "VH_M_ureteral_orifice_L" },
      { id: "neck", name: "Bladder neck", detail: "Smooth muscle around the exit that helps control urination.", mesh: "VH_M_urinary_bladder_neck_smooth_muscle" },
    ],
    quiz: {
      question: "Which muscle contracts to empty the bladder?",
      options: ["Diaphragm", "Detrusor", "Deltoid", "Trachealis"],
      answer: 1,
      explanation: "The detrusor is the smooth muscle layer of the bladder wall.",
    },
  },
  {
    id: "prostate",
    name: "Prostate and seminal glands",
    latin: "Prostata",
    system: "reproductive",
    model: hra("prostate"),
    tissue: "gland",
    accent: "#c9a0c8",
    summary:
      "Internal glands of the male reproductive system. The walnut-sized prostate surrounds the urethra below the bladder and, with the seminal vesicles, adds most of the fluid to semen.",
    role: "Produces and delivers the fluid part of semen.",
    modelScope: "The model shows the prostate zones, seminal vesicle, vas deferens, and ejaculatory duct. No external anatomy is included.",
    facts: [
      { label: "Size", value: "About 3 to 4 cm, roughly the size of a walnut", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Location", value: "Below the bladder, in front of the rectum, around the urethra" },
      { label: "Zones", value: "Peripheral, central, and transition zones plus fibromuscular stroma" },
      { label: "Seminal vesicles", value: "Supply about 60 percent of semen volume" },
    ],
    functions: [
      "Secretes a milky, slightly acidic fluid that helps sperm swim",
      "Seminal vesicles add fructose that fuels sperm",
      "Smooth muscle contracts during ejaculation to expel semen",
    ],
    terms: [
      { term: "Gland", meaning: "An organ that makes and releases a substance." },
      { term: "Vas deferens", meaning: "The muscular tube that carries sperm from the testis." },
      { term: "Seminal vesicle", meaning: "A coiled gland that adds sugar-rich fluid to semen." },
      { term: "Ejaculatory duct", meaning: "The short duct where the vas deferens and seminal vesicle join." },
      { term: "Peripheral zone", meaning: "The outer part of the prostate closest to the rectum." },
      { term: "Transition zone", meaning: "The inner part around the urethra that often enlarges with age." },
    ],
    hotspots: [
      { id: "base", name: "Base of prostate", detail: "The upper surface that sits against the bladder neck.", mesh: "VH_M_base_of_prostate" },
      { id: "apex", name: "Apex of prostate", detail: "The lower tip resting on the pelvic floor.", mesh: "VH_M_apex_of_prostate" },
      { id: "peripheral", name: "Peripheral zone", detail: "The largest zone, wrapping the back and sides of the gland.", mesh: "VH_M_peripheral_zone_of_prostate_R" },
      { id: "vesicle", name: "Seminal vesicle", detail: "A coiled pouch behind the bladder that adds fluid to semen.", mesh: "VH_M_seminal_vesicle" },
      { id: "vas", name: "Vas deferens", detail: "The tube that carries sperm up from the testis toward the prostate.", mesh: "VH_M_vas_deferens_L" },
    ],
    quiz: {
      question: "What does the prostate gland contribute to?",
      options: ["Urine production", "The fluid part of semen", "Bile storage", "Hormone insulin"],
      answer: 1,
      explanation: "Prostatic fluid mixes with sperm and seminal vesicle fluid to form semen.",
    },
  },
  {
    id: "skeleton",
    name: "Skeleton",
    latin: "Systema skeletale",
    system: "skeletal",
    model: bp3d("skeleton"),
    modelSource: "bp3d",
    tissue: "bone",
    accent: "#e9e0c9",
    summary:
      "The full adult skeleton of 206 bones: the axial skeleton of skull, vertebral column, and rib cage, and the appendicular skeleton of the limbs and the girdles that attach them.",
    role: "Supports the body, protects the organs, anchors the muscles, and makes blood cells in its marrow.",
    modelScope: "The model shows the individually named bones of the BodyParts3D reference body. Teeth, cartilage, and ligaments are not included.",
    facts: [
      { label: "Bones", value: "206 in an adult; a newborn has about 270 that later fuse", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Longest bone", value: "The femur, about a quarter of standing height" },
      { label: "Smallest bone", value: "The stapes in the middle ear, about 3 mm" },
      { label: "Divisions", value: "Axial skeleton (80 bones) and appendicular skeleton (126 bones)" },
    ],
    functions: [
      "Provides a rigid framework that supports the body against gravity",
      "Protects the brain, spinal cord, heart, and lungs",
      "Works with muscles as levers to produce movement, stores calcium, and makes blood cells in red marrow",
    ],
    terms: [
      { term: "Axial skeleton", meaning: "The skull, vertebral column, and rib cage along the body's central axis." },
      { term: "Appendicular skeleton", meaning: "The bones of the arms, legs, shoulders, and hips." },
      { term: "Vertebra", meaning: "One of the 33 bones of the spine." },
      { term: "Cranium", meaning: "The part of the skull that encloses the brain." },
      { term: "Girdle", meaning: "A ring of bones that attaches a limb to the trunk: the pectoral and pelvic girdles." },
      { term: "Long bone", meaning: "A bone longer than it is wide, such as the femur or humerus." },
      { term: "Joint", meaning: "Where two bones meet." },
      { term: "Marrow", meaning: "The soft tissue inside bones where blood cells are made." },
    ],
    hotspots: [
      { id: "skull", name: "Frontal bone", detail: "Forms the forehead and the roof of the eye sockets; one of the eight cranial bones.", mesh: "BP3D_Frontal_bone" },
      { id: "sternum", name: "Sternum", detail: "The breastbone at the front of the rib cage, where most ribs attach through cartilage.", mesh: "BP3D_Body_of_sternum" },
      { id: "humerus", name: "Humerus", detail: "The upper arm bone, from shoulder to elbow.", mesh: "BP3D_humerus_L" },
      { id: "lumbar", name: "Fifth lumbar vertebra", detail: "The largest vertebra, carrying the weight of the upper body onto the sacrum.", mesh: "BP3D_Fifth_lumbar_vertebra" },
      { id: "hip", name: "Hip bone", detail: "The fused ilium, ischium, and pubis that form each side of the pelvis.", mesh: "BP3D_hip_bone_L" },
      { id: "femur", name: "Femur", detail: "The thigh bone, the longest and strongest bone in the body.", mesh: "BP3D_femur_L" },
    ],
    quiz: {
      question: "How many bones does an adult human skeleton have?",
      options: ["106", "206", "306", "406"],
      answer: 1,
      explanation: "An adult has 206 bones; babies are born with more, which fuse as they grow.",
    },
  },
  {
    id: "pelvis",
    name: "Bony pelvis",
    latin: "Pelvis ossea",
    system: "skeletal",
    model: hra("pelvis"),
    tissue: "bone",
    accent: "#e6dcc3",
    summary:
      "The basin-shaped ring of bone that connects the spine to the legs. Each hip bone is formed from the ilium, ischium, and pubis, and the sacrum and coccyx close the ring at the back.",
    role: "Supports the trunk, transfers weight to the legs, and protects the pelvic organs.",
    facts: [
      { label: "Bones", value: "Two hip bones, sacrum, and coccyx", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Hip bone parts", value: "Ilium, ischium, and pubis, fused in adults" },
      { label: "Joint", value: "The acetabulum is the socket for the head of the femur" },
      { label: "Bone structure", value: "A hard compact shell around lighter spongy bone" },
    ],
    functions: [
      "Bears the weight of the upper body when sitting and standing",
      "Anchors the large muscles of the hip and thigh",
      "Protects the bladder, rectum, and reproductive organs",
    ],
    terms: [
      { term: "Ilium", meaning: "The broad upper wing of the hip bone that you feel at your waist." },
      { term: "Ischium", meaning: "The lower back part of the hip bone you sit on." },
      { term: "Pubis", meaning: "The front part of the hip bone that meets its partner at the midline." },
      { term: "Sacrum", meaning: "The triangular bone formed from five fused vertebrae." },
      { term: "Coccyx", meaning: "The tailbone, a small bone at the tip of the spine." },
      { term: "Compact bone", meaning: "The dense outer layer of bone." },
      { term: "Spongy bone", meaning: "The light, honeycomb-like inner bone that holds marrow." },
    ],
    hotspots: [
      { id: "ilium", name: "Ilium", detail: "The large flaring upper part of each hip bone.", mesh: "VH_M_ilium_compact_bone_L" },
      { id: "ischium", name: "Ischium", detail: "The strong lower part that carries your weight when sitting.", mesh: "VH_M_ischium_compact_bone_L" },
      { id: "pubis", name: "Pubis", detail: "The front part of the hip bone, joined to its pair at the pubic symphysis.", mesh: "VH_M_pubis_compact_bone_L" },
      { id: "sacrum", name: "Sacrum", detail: "Five fused vertebrae that lock the pelvis to the spine.", mesh: "VH_M_sacrum" },
      { id: "coccyx", name: "Coccyx", detail: "The small tailbone at the base of the spine.", mesh: "VH_M_coccyx" },
    ],
    quiz: {
      question: "Which three bones fuse to form each hip bone?",
      options: ["Femur, tibia, fibula", "Ilium, ischium, pubis", "Sacrum, coccyx, ilium", "Radius, ulna, humerus"],
      answer: 1,
      explanation: "The ilium, ischium, and pubis fuse during adolescence to form one hip bone.",
    },
  },
  {
    id: "knee",
    name: "Knee joint",
    latin: "Articulatio genus",
    system: "skeletal",
    model: hra("knee"),
    tissue: "bone",
    accent: "#e9e1cf",
    summary:
      "The largest joint in the body, a hinge between the femur and tibia with the patella in front. Cartilage and the crescent-shaped menisci cushion the bones while ligaments keep them aligned.",
    role: "Allows the leg to bend and straighten while bearing the body's weight.",
    modelScope: "This model represents the left knee with femur, tibia, fibula, patella, menisci, and articular cartilage.",
    facts: [
      { label: "Joint type", value: "Modified hinge (synovial) joint", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Bones", value: "Femur, tibia, and patella; the fibula sits alongside" },
      { label: "Cushions", value: "Medial and lateral menisci of fibrocartilage" },
      { label: "Stability", value: "Cruciate and collateral ligaments" },
    ],
    functions: [
      "Bends and straightens the leg for walking, running, and sitting",
      "Menisci spread load and absorb shock",
      "The patella improves the leverage of the thigh muscles",
    ],
    terms: [
      { term: "Femur", meaning: "The thigh bone, the longest bone in the body." },
      { term: "Tibia", meaning: "The shin bone, the main weight-bearing bone of the lower leg." },
      { term: "Fibula", meaning: "The thinner bone beside the tibia." },
      { term: "Patella", meaning: "The kneecap, a bone embedded in the thigh muscle tendon." },
      { term: "Meniscus", meaning: "A crescent of cartilage that cushions the joint." },
      { term: "Condyle", meaning: "A rounded knob at the end of a bone that forms part of a joint." },
      { term: "Articular cartilage", meaning: "The smooth glassy cartilage covering bone ends inside a joint." },
      { term: "Cruciate ligament", meaning: "One of two ligaments that cross inside the knee to stop it sliding." },
    ],
    hotspots: [
      { id: "femur", name: "Femur", detail: "The thigh bone whose rounded condyles roll on the tibia.", mesh: "VH_M_femur_L" },
      { id: "tibia", name: "Tibia", detail: "The shin bone that carries weight down to the ankle.", mesh: "VH_M_tibia_L" },
      { id: "patella", name: "Patella", detail: "The kneecap, protecting the joint and improving muscle leverage.", mesh: "VH_M_patella_L" },
      { id: "meniscus", name: "Meniscus", detail: "Fibrocartilage crescents that cushion and stabilise the joint.", mesh: "VH_M_meniscus_L" },
      { id: "cartilage", name: "Articular cartilage", detail: "The smooth coating that lets the bones glide with almost no friction.", mesh: "VH_M_articular_cartilage_of_knee_L" },
    ],
    quiz: {
      question: "What is the role of the menisci in the knee?",
      options: ["To produce synovial fluid", "To cushion and spread load between femur and tibia", "To connect muscle to bone", "To make red blood cells"],
      answer: 1,
      explanation: "The crescent-shaped menisci deepen the joint surface and absorb shock.",
    },
  },
  {
    id: "intervertebral_disk",
    name: "Intervertebral discs",
    latin: "Disci intervertebrales",
    system: "skeletal",
    model: hra("intervertebral_disk"),
    tissue: "cartilage",
    accent: "#cfd8dc",
    summary:
      "The fibrocartilage pads between the vertebrae. Each disc has a tough outer ring, the annulus fibrosus, around a soft gel core, the nucleus pulposus, which together absorb shock and allow the spine to bend.",
    role: "Cushions the vertebrae and lets the spinal column flex and twist.",
    modelScope: "The model shows the cervical, thoracic, and lumbar discs with their nucleus pulposus cores. The vertebrae themselves are not included.",
    facts: [
      { label: "Number", value: "23 discs, from C2 down to the sacrum", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Share of height", value: "About a quarter of the length of the spine" },
      { label: "Water content", value: "The nucleus is up to 80 percent water in young adults" },
      { label: "Common problem", value: "A herniated disc occurs when the nucleus pushes through the annulus" },
    ],
    functions: [
      "Absorb shocks from walking, running, and lifting",
      "Allow flexion, extension, and rotation between vertebrae",
      "Keep the gaps open through which spinal nerves exit",
    ],
    terms: [
      { term: "Annulus fibrosus", meaning: "The tough ring of fibrous layers around the outside of a disc." },
      { term: "Nucleus pulposus", meaning: "The soft gel-like centre of a disc." },
      { term: "Vertebra", meaning: "One of the bones of the spinal column." },
      { term: "Cervical", meaning: "The neck region of the spine, C1 to C7." },
      { term: "Thoracic", meaning: "The chest region, T1 to T12." },
      { term: "Lumbar", meaning: "The lower back, L1 to L5." },
      { term: "Herniation", meaning: "When the nucleus bulges or leaks through the annulus." },
    ],
    hotspots: [
      { id: "cervical", name: "C3 disc", detail: "A small cervical disc that allows the neck's wide range of movement.", mesh: "VH_M_intervertebral_disk_of_third_cervical_vertebra" },
      { id: "thoracic", name: "T6 disc", detail: "Thoracic discs are thinner because the ribs limit movement.", mesh: "VH_M_intervertebral_disk_of_sixth_thoracic_vertebra" },
      { id: "lumbar", name: "L4 disc", detail: "Lumbar discs are the largest and carry the most load.", mesh: "VH_M_intervertebral_disk_of_fourth_lumbar_vertebra" },
      { id: "nucleus", name: "L4 nucleus pulposus", detail: "The gel core that spreads pressure evenly across the disc.", mesh: "VH_M_nucleus_pulposus_of_intervertebral_disk_of_fourth_lumbar_vertebra" },
    ],
    quiz: {
      question: "What is the soft gel centre of an intervertebral disc called?",
      options: ["Annulus fibrosus", "Nucleus pulposus", "Meniscus", "Periosteum"],
      answer: 1,
      explanation: "The nucleus pulposus is the water-rich core surrounded by the annulus fibrosus.",
    },
  },
  {
    id: "skin",
    name: "Skin",
    latin: "Cutis",
    system: "integumentary",
    modelKind: "skin-patch",
    modelSource: "local",
    tissue: "skin",
    accent: "#d5a07d",
    summary:
      "A layered organ covering the body surface, forming a barrier and contributing to sensation, temperature control, immune defence, and vitamin D synthesis.",
    role: "Creates a regulated protective interface between the body and its environment.",
    modelScope: "This code generated model is a local skin cross section and contains no whole body anatomy.",
    facts: [
      { label: "Main layers", value: "Epidermis and dermis", sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: "Subcutaneous tissue", value: "Lies below the skin and is not part of the skin itself" },
      { label: "Largest organ", value: "By surface area, about 1.5 to 2 square metres" },
      { label: "Barrier protein", value: "Keratin" },
    ],
    functions: [
      "Limits water loss and blocks many external agents",
      "Sensory receptors detect touch, temperature, and pain",
      "Blood flow and sweating help regulate body temperature",
    ],
    terms: [
      { term: "Epidermis", meaning: "The thin outer layer of skin, constantly renewed from below." },
      { term: "Dermis", meaning: "The thick living layer with vessels, nerves, glands, and hair roots." },
      { term: "Subcutaneous", meaning: "Beneath the skin, describing the fatty layer that insulates the body." },
      { term: "Keratin", meaning: "The tough protein that waterproofs the surface." },
      { term: "Follicle", meaning: "The pocket in the dermis from which a hair grows." },
      { term: "Sweat gland", meaning: "A coiled tube that releases sweat to cool the body." },
      { term: "Adipose", meaning: "Fat tissue." },
    ],
    hotspots: [
      { id: "epidermis", name: "Epidermis", detail: "The avascular outer epithelium that forms the main barrier.", position: [-0.7, 0.7, 0.82] },
      { id: "dermis", name: "Dermis", detail: "Connective tissue rich layer containing vessels, nerves, and appendages.", position: [0.5, 0.2, 0.82] },
      { id: "subcutis", name: "Subcutaneous tissue", detail: "Composed mainly of loose connective tissue and adipose tissue.", position: [-0.62, -0.48, 0.82] },
    ],
    quiz: {
      question: "What is the name of the outermost main layer of skin?",
      options: ["Epidermis", "Dermis", "Fascia", "Periosteum"],
      answer: 0,
      explanation: "The epidermis is the outer layer of the skin, with the dermis beneath it.",
    },
  },
];

export const organById = Object.fromEntries(organs.map((organ) => [organ.id, organ])) as Record<string, Organ>;

export const hraModelCount = organs.filter((organ) => organ.model && organ.modelSource !== "bp3d").length;
export const bp3dModelCount = organs.filter((organ) => organ.modelSource === "bp3d").length;

export const anatomySources = [
  {
    id: "hra",
    title: "Human Reference Atlas 3D Reference Object Library",
    detail: `Source of the ${hraModelCount} binary organ models. The objects are released under CC BY 4.0 and maintained by the HuBMAP Human Reference Atlas project.`,
    url: "https://humanatlas.io/3d-reference-library",
  },
  {
    id: "bp3d",
    title: "BodyParts3D 4.0",
    detail: `Source of the ${bp3dModelCount} whole-body models (stomach and skeleton). Published by the Database Center for Life Science under CC BY 4.0 and shared with the Human Atlas body tab.`,
    url: "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html",
  },
  {
    id: "openstax",
    title: "OpenStax Anatomy and Physiology 2e",
    detail: "A foundational reference for organ structure and physiology, licensed under CC BY 4.0.",
    url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
  },
  {
    id: "medlineplus",
    title: "U.S. National Library of Medicine MedlinePlus",
    detail: "A public reference entry point for health and body systems.",
    url: "https://medlineplus.gov/anatomy.html",
  },
];
