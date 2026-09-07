/**
 * Descriptive terms for the named structures inside the HRA models.
 *
 * Every mesh in a Human Reference Atlas model carries a semantic object name
 * such as `VH_M_heart_left_ventricle` or `Allen_superior_frontal_gyrus_L`.
 * This module turns those identifiers into readable labels and attaches a
 * short explanation wherever a rule matches, so clicking any part of a model
 * gives the learner a real anatomical term and its meaning.
 */

export type StructureInfo = {
  /** Readable anatomical name, for example "Left ventricle". */
  label: string;
  /** Side of the body when the identifier carries one. */
  side?: "left" | "right";
  /** Plain-English explanation when a glossary rule matches. */
  meaning?: string;
  /** Broad tissue category used by the realistic material pass. */
  tissue?: "muscle" | "neural" | "lung" | "liver" | "gland" | "mucosa" | "kidney" | "vessel" | "bone" | "cartilage" | "eye" | "lymphoid" | "ligament" | "fluid" | "skin";
};

type Rule = {
  match: RegExp;
  meaning: string;
  tissue?: StructureInfo["tissue"];
};

/**
 * Ordered glossary rules. The first rule whose pattern matches the
 * normalised identifier (lower case, underscores replaced by spaces) wins.
 */
const rules: Rule[] = [
  // Heart
  { match: /left ventricle/, meaning: "The thick-walled chamber that pumps oxygenated blood into the aorta and around the body.", tissue: "muscle" },
  { match: /right ventricle/, meaning: "The chamber that pumps deoxygenated blood to the lungs through the pulmonary trunk.", tissue: "muscle" },
  { match: /left (cardiac )?atrium/, meaning: "The upper chamber that receives oxygenated blood from the pulmonary veins.", tissue: "muscle" },
  { match: /right (cardiac )?atrium/, meaning: "The upper chamber that receives deoxygenated blood from the venae cavae.", tissue: "muscle" },
  { match: /interventricular septum/, meaning: "The muscular wall between the two ventricles.", tissue: "muscle" },
  { match: /mitral valve/, meaning: "The two-flap valve between the left atrium and left ventricle.", tissue: "ligament" },
  { match: /tricuspid valve/, meaning: "The three-flap valve between the right atrium and right ventricle.", tissue: "ligament" },
  { match: /aortic valve/, meaning: "The semilunar valve at the exit of the left ventricle into the aorta.", tissue: "ligament" },
  { match: /pulmonary valve/, meaning: "The semilunar valve at the exit of the right ventricle into the pulmonary trunk.", tissue: "ligament" },
  { match: /papillary muscle/, meaning: "A cone of muscle inside a ventricle that tightens the valve cords so the flaps do not flip backwards.", tissue: "muscle" },

  // Vessels
  { match: /aortic arch/, meaning: "The curved top of the aorta that gives off arteries to the head, neck, and arms.", tissue: "vessel" },
  { match: /ascending aorta/, meaning: "The first part of the aorta, rising from the left ventricle and giving off the coronary arteries.", tissue: "vessel" },
  { match: /descending aorta/, meaning: "The aorta as it runs down through the chest and abdomen.", tissue: "vessel" },
  { match: /superior vena cava/, meaning: "The great vein returning blood from the head, neck, and arms to the right atrium.", tissue: "vessel" },
  { match: /inferior vena cava/, meaning: "The great vein returning blood from the lower body to the right atrium.", tissue: "vessel" },
  { match: /pulmonary trunk/, meaning: "The artery leaving the right ventricle that splits into the two pulmonary arteries.", tissue: "vessel" },
  { match: /pulmonary artery/, meaning: "Carries deoxygenated blood from the heart to a lung.", tissue: "vessel" },
  { match: /pulmonary vein/, meaning: "Carries oxygenated blood from a lung back to the left atrium.", tissue: "vessel" },
  { match: /coronary sinus/, meaning: "The large vein on the back of the heart that drains the heart muscle.", tissue: "vessel" },
  { match: /coronary artery/, meaning: "An artery that supplies the heart muscle itself with blood.", tissue: "vessel" },
  { match: /carotid artery/, meaning: "A main artery of the neck carrying blood toward the head and brain.", tissue: "vessel" },
  { match: /subclavian artery/, meaning: "The artery running under the collarbone toward the arm.", tissue: "vessel" },
  { match: /brachiocephalic/, meaning: "The short trunk from the aortic arch that supplies the right arm and right side of the head.", tissue: "vessel" },
  { match: /hepatic portal vein|portal vein/, meaning: "Carries nutrient-rich blood from the intestines to the liver for processing.", tissue: "vessel" },
  { match: /hepatic vein/, meaning: "Drains blood from the liver into the inferior vena cava.", tissue: "vessel" },
  { match: /renal artery/, meaning: "Delivers a quarter of the heart's output to a kidney for filtering.", tissue: "vessel" },
  { match: /renal vein/, meaning: "Returns filtered blood from a kidney to the inferior vena cava.", tissue: "vessel" },
  { match: /mesenteric artery/, meaning: "Supplies blood to the intestines.", tissue: "vessel" },
  { match: /mesenteric vein/, meaning: "Collects blood from the intestines and feeds it into the portal vein.", tissue: "vessel" },
  { match: /iliac artery/, meaning: "Carries blood from the aorta toward the pelvis and leg.", tissue: "vessel" },
  { match: /iliac vein/, meaning: "Returns blood from the pelvis and leg toward the inferior vena cava.", tissue: "vessel" },
  { match: /splenic/, meaning: "Relating to the spleen.", tissue: "vessel" },
  { match: /ophthalmic|retinal (artery|vein)|ciliary artery/, meaning: "A small vessel supplying or draining the eye.", tissue: "vessel" },
  { match: /colic (artery|vein)|sigmoid (artery|vein)|rectal (vein|artery)|marginal artery|ileocolic/, meaning: "A vessel serving part of the large intestine.", tissue: "vessel" },
  { match: /pancreaticoduodenal/, meaning: "A vessel serving the pancreas and duodenum.", tissue: "vessel" },
  { match: /pudendal|sacral vein|gonadal|testicular|suprarenal|lumbar (artery|vein)|phrenic|celiac|gastric (artery|vein)|gastroduodenal|cystic (artery|vein)|azygos|hemiazygos|intercostal|thoracic (artery|vein)|vertebral (artery|vein)|jugular|femoral|umbilical/, meaning: "A named blood vessel of the trunk.", tissue: "vessel" },
  { match: /\bvein\b/, meaning: "A vessel that carries blood back toward the heart.", tissue: "vessel" },
  { match: /\barter(y|ies)\b/, meaning: "A vessel that carries blood away from the heart.", tissue: "vessel" },

  // Brain
  { match: /primary motor cortex/, meaning: "The strip of cortex in front of the central sulcus that sends movement commands to muscles.", tissue: "neural" },
  { match: /postcentral gyrus/, meaning: "The primary somatosensory cortex, which receives touch and body-position signals.", tissue: "neural" },
  { match: /frontal gyrus|frontal pole|frontal operculum|frontomarginal|rostral gyrus|paracingulate|orbital gyrus|gyrus rectus/, meaning: "Part of the frontal lobe, involved in planning, decision making, personality, and voluntary movement.", tissue: "neural" },
  { match: /temporal gyrus|temporal pole|planum temporale|planum polare|heschl/, meaning: "Part of the temporal lobe, involved in hearing, language, and memory.", tissue: "neural" },
  { match: /parietal|supramarginal|angular gyrus|precuneus|paracentral lobule/, meaning: "Part of the parietal lobe, which integrates touch, spatial awareness, and attention.", tissue: "neural" },
  { match: /occipital|cuneus|lingual gyrus/, meaning: "Part of the occipital lobe, home of the visual cortex.", tissue: "neural" },
  { match: /fusiform|occipitotemporal/, meaning: "A gyrus on the underside of the brain involved in recognising faces and objects.", tissue: "neural" },
  { match: /insula/, meaning: "The cortex folded deep inside the lateral fissure, involved in taste, emotion, and body awareness.", tissue: "neural" },
  { match: /cingulate|subcallosal/, meaning: "Part of the limbic cortex above the corpus callosum, involved in emotion and attention.", tissue: "neural" },
  { match: /parahippocampal|perirhinal|gyrus ambiens|isthmus/, meaning: "Cortex beside the hippocampus that supports memory encoding.", tissue: "neural" },
  { match: /hippocamp/, meaning: "The seahorse-shaped structure essential for forming new memories.", tissue: "neural" },
  { match: /amygdal|cortical nucleus|basolateral|basomedial|central nuclear group|medial nucleus|lateral nucleus\b/, meaning: "Part of the amygdala, the almond-shaped centre for fear and emotional memory.", tissue: "neural" },
  { match: /caudate|putamen|globus pallidus|accumbens|claustrum/, meaning: "A basal ganglia nucleus that helps select and smooth movements and process reward.", tissue: "neural" },
  { match: /thalam/, meaning: "Part of the thalamus, the relay station that passes sensory information to the cortex.", tissue: "neural" },
  { match: /geniculate/, meaning: "A thalamic relay nucleus for vision or hearing.", tissue: "neural" },
  { match: /hypothalamus|hth\b|supraoptic|preoptic|tuberal|mammillary|zona incerta|subthalamic/, meaning: "Part of the hypothalamus, which controls hunger, thirst, temperature, and the pituitary gland.", tissue: "neural" },
  { match: /pineal/, meaning: "The pineal gland, which secretes melatonin to regulate sleep cycles.", tissue: "gland" },
  { match: /habenul|septal|basal forebrain|bed nucleus|stria terminalis|piriform|olfactory/, meaning: "A deep forebrain structure linked to smell, motivation, or emotion.", tissue: "neural" },
  { match: /corpus callosum/, meaning: "The thick band of fibres connecting the two hemispheres.", tissue: "neural" },
  { match: /anterior commissure|fornix|optic tract|optic radiation|optic chiasm|mammillothalamic|white matter/, meaning: "A bundle of myelinated fibres carrying signals between brain regions.", tissue: "neural" },
  { match: /lateral ventricle|third ventricle|fourth ventricle|cerebral aqueduct|central canal/, meaning: "Part of the fluid-filled ventricular system that circulates cerebrospinal fluid.", tissue: "fluid" },
  { match: /cerebell/, meaning: "Part of the cerebellum, which coordinates balance and fine movement.", tissue: "neural" },
  { match: /vermis|paravermis/, meaning: "The midline part of the cerebellum that controls posture and gait.", tissue: "neural" },
  { match: /pons|pontine/, meaning: "Part of the pons, the bridge of the brainstem that relays signals and helps control breathing.", tissue: "neural" },
  { match: /medulla oblongata|inferior olive|pyramidal part/, meaning: "Part of the medulla, which controls heart rate, breathing, and swallowing.", tissue: "neural" },
  { match: /midbrain|colliculus|red nucleus|substantia nigra|pretectal|cerebral peduncle|crus cerebri/, meaning: "Part of the midbrain, involved in eye movement, hearing reflexes, and motor control.", tissue: "neural" },

  // Spinal cord
  { match: /cervical spinal cord|segment of cervical/, meaning: "A neck segment of the spinal cord supplying the neck, diaphragm, and arms.", tissue: "neural" },
  { match: /thoracic spinal cord/, meaning: "A chest segment of the spinal cord supplying the trunk.", tissue: "neural" },
  { match: /lumbar spinal cord/, meaning: "A lower-back segment of the spinal cord supplying the front of the legs.", tissue: "neural" },
  { match: /sacral spinal cord/, meaning: "A sacral segment of the spinal cord supplying the pelvis and the back of the legs.", tissue: "neural" },

  // Eye
  { match: /cornea/, meaning: "The clear front window that does most of the eye's focusing.", tissue: "eye" },
  { match: /\blens\b/, meaning: "The flexible transparent disc that fine-tunes focus.", tissue: "eye" },
  { match: /suspensory ligament/, meaning: "The fibres that hold the lens and change its shape.", tissue: "ligament" },
  { match: /iris/, meaning: "The coloured ring of muscle that changes the size of the pupil.", tissue: "muscle" },
  { match: /pupil/, meaning: "The opening in the iris that lets light in.", tissue: "fluid" },
  { match: /retina/, meaning: "The light-sensitive lining containing rods and cones.", tissue: "eye" },
  { match: /fovea/, meaning: "The pit in the retina with the sharpest vision.", tissue: "eye" },
  { match: /macula/, meaning: "The central area of the retina responsible for detailed vision.", tissue: "eye" },
  { match: /optic disc/, meaning: "Where the optic nerve leaves the eye; the blind spot.", tissue: "neural" },
  { match: /sclera/, meaning: "The tough white outer coat of the eye.", tissue: "eye" },
  { match: /choroid/, meaning: "The dark vascular layer that nourishes the retina.", tissue: "vessel" },
  { match: /ciliary (body|muscle|process)/, meaning: "The ring of muscle and tissue that changes lens shape and makes aqueous humour.", tissue: "muscle" },
  { match: /aqueous humor/, meaning: "The watery fluid in the front of the eye.", tissue: "fluid" },
  { match: /vitreous humor/, meaning: "The clear jelly that fills the back of the eye.", tissue: "fluid" },
  { match: /conjunctiva/, meaning: "The thin membrane covering the white of the eye and lining the eyelids.", tissue: "mucosa" },
  { match: /trabecular meshwork|schlemm/, meaning: "The drainage system that lets aqueous humour leave the eye.", tissue: "ligament" },
  { match: /corneo scleral|limbus/, meaning: "The border between the cornea and the sclera.", tissue: "eye" },

  // Airways and lungs
  { match: /bronchopulmonary segment/, meaning: "A wedge of lung tissue ventilated by its own segmental bronchus.", tissue: "lung" },
  { match: /lobar bronchus/, meaning: "A bronchus that ventilates one lobe of a lung.", tissue: "mucosa" },
  { match: /main bronchus|intermediate bronchus/, meaning: "A large airway leading from the trachea into a lung.", tissue: "mucosa" },
  { match: /bronchus|bronchi\b|basal\b/, meaning: "A segmental bronchus that ventilates one part of a lobe.", tissue: "mucosa" },
  { match: /cartilage of the (main|lobar|tertiary) bronchus|bronchial cartilage/, meaning: "Plates of cartilage that hold a bronchus open.", tissue: "cartilage" },
  { match: /hilum/, meaning: "The root where vessels, ducts, or airways enter and leave an organ.", tissue: "mucosa" },
  { match: /carina/, meaning: "The ridge where the trachea divides into the two main bronchi.", tissue: "cartilage" },
  { match: /tracheal cartilage/, meaning: "The C-shaped cartilage rings that keep the windpipe open.", tissue: "cartilage" },
  { match: /trachea/, meaning: "The windpipe carrying air between the larynx and the bronchi.", tissue: "mucosa" },
  { match: /thyroid cartilage/, meaning: "The large shield-shaped cartilage forming the Adam's apple.", tissue: "cartilage" },
  { match: /cricoid/, meaning: "The complete ring of cartilage at the base of the larynx.", tissue: "cartilage" },
  { match: /epiglott/, meaning: "The leaf-shaped flap that closes the airway during swallowing.", tissue: "cartilage" },
  { match: /arytenoid/, meaning: "A small pyramid-shaped cartilage that moves the vocal folds.", tissue: "cartilage" },
  { match: /corniculate/, meaning: "A tiny horn of cartilage on top of the arytenoid.", tissue: "cartilage" },

  // Mouth
  { match: /dorsal tongue/, meaning: "The upper surface of the tongue, carrying the taste buds.", tissue: "muscle" },
  { match: /ventral tongue/, meaning: "The smooth underside of the tongue.", tissue: "mucosa" },
  { match: /tongue/, meaning: "The muscular organ that moves food and carries taste buds.", tissue: "muscle" },
  { match: /papillae/, meaning: "Small bumps on the tongue that hold taste buds.", tissue: "mucosa" },
  { match: /teeth/, meaning: "Hard structures that cut and grind food.", tissue: "bone" },
  { match: /parotid/, meaning: "The largest salivary gland, in front of the ear.", tissue: "gland" },
  { match: /submandibular/, meaning: "The salivary gland under the jaw that makes most resting saliva.", tissue: "gland" },
  { match: /sublingual/, meaning: "The small salivary gland under the tongue.", tissue: "gland" },
  { match: /hard palate/, meaning: "The bony roof of the mouth.", tissue: "bone" },
  { match: /soft palate/, meaning: "The muscular back part of the roof of the mouth that closes off the nose when swallowing.", tissue: "mucosa" },
  { match: /gingiva|ginviva/, meaning: "The gums that surround the teeth.", tissue: "mucosa" },
  { match: /mandible/, meaning: "The lower jaw bone.", tissue: "bone" },
  { match: /buccal mucosa|mouth floor|frenulum/, meaning: "Part of the soft lining of the mouth.", tissue: "mucosa" },

  // Liver and gallbladder
  { match: /porta hepatis/, meaning: "The gateway where vessels and bile ducts enter and leave the liver.", tissue: "liver" },
  { match: /caudate lobe/, meaning: "A small lobe on the back of the liver next to the inferior vena cava.", tissue: "liver" },
  { match: /quadrate lobe/, meaning: "A small lobe on the underside of the liver next to the gallbladder.", tissue: "liver" },
  { match: /segment$/, meaning: "One of the eight functional liver segments, each with its own blood supply and bile drainage.", tissue: "liver" },
  { match: /bare area/, meaning: "The part of the liver surface with no peritoneum, in direct contact with the diaphragm.", tissue: "liver" },
  { match: /impression of liver/, meaning: "A shallow dent on the liver surface made by a neighbouring organ.", tissue: "liver" },
  { match: /diaphragmatic surface/, meaning: "The smooth convex surface that rests against the diaphragm.", tissue: "liver" },
  { match: /liver capsule/, meaning: "The thin fibrous coat around the liver.", tissue: "liver" },
  { match: /falciform|coronary ligament|triangular ligament|round ligament|ligamentum venosum|hepataduodenal|hepatoduodenal/, meaning: "A fold of peritoneum or remnant vessel that anchors the liver.", tissue: "ligament" },
  { match: /gallbladder/, meaning: "The pear-shaped sac that stores and concentrates bile.", tissue: "mucosa" },

  // Pancreas
  { match: /head of pancreas/, meaning: "The widest part, cradled by the curve of the duodenum.", tissue: "gland" },
  { match: /neck of pancreas/, meaning: "The short narrow part in front of the portal vein.", tissue: "gland" },
  { match: /body of pancreas/, meaning: "The central part crossing behind the stomach.", tissue: "gland" },
  { match: /tail of pancreas/, meaning: "The narrow end that reaches the spleen.", tissue: "gland" },
  { match: /uncinate/, meaning: "The hook-shaped extension of the head that tucks behind the mesenteric vessels.", tissue: "gland" },

  // Intestines
  { match: /duodenal ampulla|hepatopancreatic ampulla/, meaning: "The chamber where the bile and pancreatic ducts empty into the duodenum.", tissue: "mucosa" },
  { match: /sphincter of hepatopancreatic|papilla of santorini/, meaning: "A muscular valve or opening for the bile and pancreatic ducts.", tissue: "muscle" },
  { match: /duodenum/, meaning: "The first C-shaped part of the small intestine.", tissue: "mucosa" },
  { match: /jejunum/, meaning: "The middle section of the small intestine where most absorption occurs.", tissue: "mucosa" },
  { match: /ileum terminal/, meaning: "The final stretch of the ileum before the caecum.", tissue: "mucosa" },
  { match: /ileum/, meaning: "The last section of the small intestine.", tissue: "mucosa" },
  { match: /ileocecal|ileocaecal/, meaning: "The valve that stops contents flowing back from the caecum into the ileum.", tissue: "muscle" },
  { match: /caecum|cecum/, meaning: "The blind pouch at the start of the large intestine.", tissue: "mucosa" },
  { match: /appendix/, meaning: "The narrow blind pouch attached to the caecum.", tissue: "lymphoid" },
  { match: /ascending colon/, meaning: "The colon rising on the right side of the abdomen.", tissue: "mucosa" },
  { match: /transverse colon/, meaning: "The colon crossing the abdomen below the stomach.", tissue: "mucosa" },
  { match: /descending colon/, meaning: "The colon running down the left side of the abdomen.", tissue: "mucosa" },
  { match: /sigmoid colon/, meaning: "The S-shaped final loop of the colon.", tissue: "mucosa" },
  { match: /hepatic flexure/, meaning: "The bend under the liver between ascending and transverse colon.", tissue: "mucosa" },
  { match: /splenic flexure/, meaning: "The bend under the spleen between transverse and descending colon.", tissue: "mucosa" },
  { match: /rectum/, meaning: "The final straight section that stores faeces.", tissue: "mucosa" },
  { match: /epiploic|omentum/, meaning: "A fatty fold of peritoneum.", tissue: "gland" },

  // Spleen, thymus, lymph
  { match: /colic surface of spleen/, meaning: "The face of the spleen resting on the colon.", tissue: "lymphoid" },
  { match: /gastric surface of spleen/, meaning: "The concave face resting against the stomach.", tissue: "lymphoid" },
  { match: /renal surface of spleen/, meaning: "The face lying against the left kidney.", tissue: "lymphoid" },
  { match: /diaphragmatic surface of spleen/, meaning: "The smooth convex face against the diaphragm.", tissue: "lymphoid" },
  { match: /hilum of spleen/, meaning: "Where the splenic vessels enter and leave.", tissue: "lymphoid" },
  { match: /thymus lobe/, meaning: "One of the two lobes of the thymus where T cells mature.", tissue: "lymphoid" },
  { match: /afferent lymphatic/, meaning: "A vessel bringing lymph into the node.", tissue: "vessel" },
  { match: /efferent/, meaning: "The vessel carrying filtered lymph out of the node.", tissue: "vessel" },
  { match: /capsule of lymph node/, meaning: "The fibrous coat around the lymph node.", tissue: "lymphoid" },
  { match: /follicle/, meaning: "A rounded cluster of B cells in the cortex.", tissue: "lymphoid" },
  { match: /paracortex/, meaning: "The T cell zone between cortex and medulla.", tissue: "lymphoid" },
  { match: /medulla of lymph node/, meaning: "Cords of plasma cells and macrophages near the exit.", tissue: "lymphoid" },
  { match: /blood vasculature/, meaning: "The blood vessels supplying the node.", tissue: "vessel" },
  { match: /tonsil/, meaning: "A mass of lymphoid tissue guarding the throat.", tissue: "lymphoid" },

  // Kidney and urinary
  { match: /kidney capsule/, meaning: "The tough fibrous coat around the kidney.", tissue: "kidney" },
  { match: /outer cortex of kidney/, meaning: "The outer layer holding the glomeruli where filtering begins.", tissue: "kidney" },
  { match: /renal column/, meaning: "Cortical tissue dipping between the pyramids.", tissue: "kidney" },
  { match: /renal pyramid/, meaning: "A cone of collecting ducts that drains urine to a papilla.", tissue: "kidney" },
  { match: /renal papilla/, meaning: "The tip of a pyramid where urine drips into a calyx.", tissue: "kidney" },
  { match: /hilum of kidney/, meaning: "The notch where the renal artery, vein, and ureter pass.", tissue: "kidney" },
  { match: /minor calyx/, meaning: "A cup around one papilla that catches urine.", tissue: "mucosa" },
  { match: /major calyx/, meaning: "A chamber formed by several minor calyces.", tissue: "mucosa" },
  { match: /renal pelvis/, meaning: "The funnel that gathers urine before the ureter.", tissue: "mucosa" },
  { match: /ureteral orifice/, meaning: "The slit-like opening where a ureter enters the bladder.", tissue: "mucosa" },
  { match: /ureter/, meaning: "The muscular tube carrying urine from kidney to bladder.", tissue: "mucosa" },
  { match: /trigone/, meaning: "The smooth triangle on the bladder floor between the ureter openings and the urethra.", tissue: "mucosa" },
  { match: /bladder dome|fundus of urinary bladder/, meaning: "The stretchy upper part of the bladder.", tissue: "muscle" },
  { match: /bladder neck/, meaning: "The narrow lower part of the bladder leading into the urethra.", tissue: "muscle" },
  { match: /bladder/, meaning: "The hollow muscular bag that stores urine.", tissue: "muscle" },

  // Reproductive
  { match: /vas deferens/, meaning: "The muscular tube carrying sperm from the testis.", tissue: "muscle" },
  { match: /seminal vesicle/, meaning: "A coiled gland adding sugar-rich fluid to semen.", tissue: "gland" },
  { match: /ejaculatory duct/, meaning: "The short duct through the prostate formed by the vas deferens and seminal vesicle.", tissue: "mucosa" },
  { match: /prostatic utricle|seminal colliculus/, meaning: "A small landmark inside the prostatic urethra.", tissue: "mucosa" },
  { match: /prostate duct/, meaning: "A duct that carries prostatic fluid into the urethra.", tissue: "mucosa" },
  { match: /peripheral zone/, meaning: "The outer zone of the prostate closest to the rectum.", tissue: "gland" },
  { match: /transition zone/, meaning: "The inner zone around the urethra that often enlarges with age.", tissue: "gland" },
  { match: /central zone/, meaning: "The zone surrounding the ejaculatory ducts.", tissue: "gland" },
  { match: /fibromuscular stroma/, meaning: "The front wall of muscle and fibre that has no glands.", tissue: "muscle" },
  { match: /apex of prostate/, meaning: "The lower tip of the prostate resting on the pelvic floor.", tissue: "gland" },
  { match: /base of prostate/, meaning: "The upper surface of the prostate against the bladder neck.", tissue: "gland" },

  // Whole skeleton (BodyParts3D)
  { match: /^atlas$/, meaning: "The first cervical vertebra, which carries the skull and lets you nod.", tissue: "bone" },
  { match: /^axis$/, meaning: "The second cervical vertebra, whose peg lets the head turn side to side.", tissue: "bone" },
  { match: /cervical vertebra/, meaning: "One of the seven neck vertebrae.", tissue: "bone" },
  { match: /thoracic vertebra/, meaning: "One of the twelve chest vertebrae that carry the ribs.", tissue: "bone" },
  { match: /lumbar vertebra/, meaning: "One of the five large lower-back vertebrae that carry most of the body's weight.", tissue: "bone" },
  { match: /\brib\b/, meaning: "One of twelve pairs of curved bones that protect the heart and lungs and move with breathing.", tissue: "bone" },
  { match: /manubrium/, meaning: "The top part of the breastbone, where the collarbones attach.", tissue: "bone" },
  { match: /body of sternum/, meaning: "The long middle part of the breastbone.", tissue: "bone" },
  { match: /xiphoid/, meaning: "The small pointed tip at the bottom of the breastbone.", tissue: "cartilage" },
  { match: /clavicle/, meaning: "The collarbone, which braces the shoulder against the breastbone.", tissue: "bone" },
  { match: /scapula/, meaning: "The shoulder blade.", tissue: "bone" },
  { match: /humerus/, meaning: "The upper arm bone.", tissue: "bone" },
  { match: /\bradius\b/, meaning: "The forearm bone on the thumb side.", tissue: "bone" },
  { match: /\bulna\b/, meaning: "The forearm bone on the little-finger side, forming the point of the elbow.", tissue: "bone" },
  { match: /scaphoid|lunate|triquetr|pisiform|trapezium|trapezoid|capitate|hamate/, meaning: "One of the eight small carpal bones of the wrist.", tissue: "bone" },
  { match: /metacarpal/, meaning: "One of the five bones of the palm.", tissue: "bone" },
  { match: /phalanx.*(finger|thumb)/, meaning: "A finger bone; each finger has three and the thumb two.", tissue: "bone" },
  { match: /phalanx.*toe/, meaning: "A toe bone; each toe has three and the big toe two.", tissue: "bone" },
  { match: /hip bone/, meaning: "The fused ilium, ischium, and pubis forming one side of the pelvis.", tissue: "bone" },
  { match: /talus/, meaning: "The ankle bone that sits between the shin and the heel.", tissue: "bone" },
  { match: /calcaneus/, meaning: "The heel bone, the largest bone of the foot.", tissue: "bone" },
  { match: /navicular|cuboid|cuneiform/, meaning: "One of the small tarsal bones of the midfoot.", tissue: "bone" },
  { match: /metatarsal/, meaning: "One of the five long bones of the foot.", tissue: "bone" },
  { match: /sesamoid/, meaning: "A small bone embedded in a tendon, like a pulley.", tissue: "bone" },
  { match: /frontal bone/, meaning: "The forehead bone and roof of the eye sockets.", tissue: "bone" },
  { match: /parietal bone/, meaning: "One of the two bones forming the sides and roof of the skull.", tissue: "bone" },
  { match: /temporal bone/, meaning: "The bone at the side of the skull that houses the ear.", tissue: "bone" },
  { match: /occipital bone/, meaning: "The bone at the back and base of the skull, with the opening for the spinal cord.", tissue: "bone" },
  { match: /sphenoid/, meaning: "The butterfly-shaped bone at the base of the skull that holds the pituitary gland.", tissue: "bone" },
  { match: /ethmoid/, meaning: "The light spongy bone between the eye sockets and nasal cavity.", tissue: "bone" },
  { match: /zygomatic/, meaning: "The cheekbone.", tissue: "bone" },
  { match: /maxilla/, meaning: "The upper jaw, which holds the upper teeth.", tissue: "bone" },
  { match: /nasal bone/, meaning: "One of the two small bones forming the bridge of the nose.", tissue: "bone" },
  { match: /lacrimal bone/, meaning: "The tiny bone at the inner corner of the eye socket.", tissue: "bone" },
  { match: /vomer/, meaning: "The thin bone that forms the lower part of the nasal septum.", tissue: "bone" },
  { match: /palatine bone/, meaning: "The bone forming the back of the hard palate.", tissue: "bone" },
  { match: /nasal concha/, meaning: "A curled bone inside the nose that warms and moistens air.", tissue: "bone" },
  { match: /hyoid/, meaning: "The U-shaped bone in the neck that anchors the tongue; the only bone not joined to another.", tissue: "bone" },

  // Muscles (BodyParts3D)
  { match: /diaphragm/, meaning: "The dome-shaped sheet of muscle that drives breathing.", tissue: "muscle" },
  { match: /deltoid/, meaning: "The shoulder muscle that raises the arm.", tissue: "muscle" },
  { match: /pectoralis/, meaning: "A chest muscle that pulls the arm forward and across the body.", tissue: "muscle" },
  { match: /trapezius/, meaning: "The large upper-back muscle that shrugs and steadies the shoulders.", tissue: "muscle" },
  { match: /latissimus/, meaning: "The broad back muscle that pulls the arm down and back.", tissue: "muscle" },
  { match: /biceps brachii/, meaning: "The front upper-arm muscle that bends the elbow.", tissue: "muscle" },
  { match: /triceps/, meaning: "The back upper-arm muscle that straightens the elbow.", tissue: "muscle" },
  { match: /brachialis|brachioradialis|coracobrachialis/, meaning: "An upper-arm muscle that helps bend the elbow.", tissue: "muscle" },
  { match: /gluteus/, meaning: "A buttock muscle that extends and steadies the hip.", tissue: "muscle" },
  { match: /rectus femoris|vastus/, meaning: "Part of the quadriceps at the front of the thigh, which straightens the knee.", tissue: "muscle" },
  { match: /biceps femoris|semitendinosus|semimembranosus/, meaning: "A hamstring at the back of the thigh, which bends the knee.", tissue: "muscle" },
  { match: /sartorius/, meaning: "The longest muscle, crossing the thigh to help cross the legs.", tissue: "muscle" },
  { match: /adductor|gracilis|pectineus/, meaning: "An inner-thigh muscle that pulls the leg inward.", tissue: "muscle" },
  { match: /gastrocnemius|soleus|plantaris/, meaning: "A calf muscle that points the foot and pushes off in walking.", tissue: "muscle" },
  { match: /tibialis/, meaning: "A shin muscle that lifts or turns the foot.", tissue: "muscle" },
  { match: /fibularis|peroneus/, meaning: "A muscle on the outer leg that turns the sole outward.", tissue: "muscle" },
  { match: /external oblique|internal oblique|transversus abdominis|rectus abdominis/, meaning: "An abdominal wall muscle that bends the trunk and supports the organs.", tissue: "muscle" },
  { match: /intercostal/, meaning: "A muscle between the ribs that helps breathing.", tissue: "muscle" },
  { match: /sternocleidomastoid/, meaning: "The neck muscle that turns and tilts the head.", tissue: "muscle" },
  { match: /scalenus/, meaning: "A deep neck muscle that lifts the upper ribs.", tissue: "muscle" },
  { match: /masseter|temporalis|pterygoid/, meaning: "A jaw muscle used for chewing.", tissue: "muscle" },
  { match: /psoas|iliacus/, meaning: "A deep hip flexor that lifts the thigh.", tissue: "muscle" },
  { match: /erector|iliocostalis|longissimus|spinalis|semispinalis|multifidus|rotator/, meaning: "A deep back muscle that straightens and steadies the spine.", tissue: "muscle" },
  { match: /rhomboid|levator scapulae|serratus/, meaning: "A muscle that moves and stabilises the shoulder blade.", tissue: "muscle" },
  { match: /supraspinatus|infraspinatus|teres|subscapularis/, meaning: "A rotator-cuff muscle that steadies the shoulder.", tissue: "muscle" },
  { match: /flexor|palmaris|pronator|opponens|lumbrical|interosse|abductor|extensor|supinator|anconeus/, meaning: "A muscle of the forearm, hand, leg, or foot that moves the fingers or toes.", tissue: "muscle" },
  { match: /hyoid|glossus|digastric|platysma|constrictor|palat|arytenoid|cricothyroid|thyro|vocalis|uvul|aryepiglott|stylo/, meaning: "A small muscle of the throat, tongue, or larynx used in swallowing and speech.", tissue: "muscle" },
  { match: /levator palpebrae|rectus$|oblique$|capitis|longus colli|sphincter|coccygeus|perineal|levator ani|obturator|piriformis|gemellus|quadratus|popliteus|splenius|transversus/, meaning: "A skeletal muscle of the reference body.", tissue: "muscle" },

  // Endocrine, urinary, reproductive, nose (BodyParts3D)
  { match: /pituitary/, meaning: "The master gland beneath the brain that controls growth and other glands.", tissue: "gland" },
  { match: /pineal/, meaning: "The gland deep in the brain that makes melatonin.", tissue: "gland" },
  { match: /adrenal/, meaning: "The gland on top of each kidney that makes adrenaline and cortisol.", tissue: "gland" },
  { match: /^kidney$/, meaning: "The bean-shaped organ that filters blood and forms urine.", tissue: "kidney" },
  { match: /urethra/, meaning: "The tube that carries urine from the bladder out of the body.", tissue: "mucosa" },
  { match: /^urinary bladder$/, meaning: "The muscular bag that stores urine.", tissue: "muscle" },
  { match: /testis/, meaning: "The male gonad that makes sperm and testosterone.", tissue: "gland" },
  { match: /epididymis/, meaning: "The coiled tube where sperm mature and are stored.", tissue: "mucosa" },
  { match: /deferent duct/, meaning: "The vas deferens, carrying sperm toward the urethra.", tissue: "muscle" },
  { match: /^prostate$/, meaning: "The gland below the bladder that adds fluid to semen.", tissue: "gland" },
  { match: /septal nasal cartilage|lateral nasal cartilage/, meaning: "Flexible cartilage that shapes the nose.", tissue: "cartilage" },
  { match: /pharyngeal constrictor/, meaning: "A throat muscle that squeezes swallowed food downward.", tissue: "muscle" },

  // Stomach (BodyParts3D)
  { match: /^stomach$/, meaning: "The muscular bag that stores food and mixes it with acid and pepsin.", tissue: "mucosa" },
  { match: /esophagus|oesophagus/, meaning: "The muscular tube that carries swallowed food to the stomach.", tissue: "mucosa" },

  // Skeleton
  { match: /compact bone/, meaning: "The dense outer shell of a bone.", tissue: "bone" },
  { match: /spongy bone/, meaning: "The light honeycomb bone inside that holds marrow.", tissue: "bone" },
  { match: /sacrum/, meaning: "The triangular bone of five fused vertebrae at the back of the pelvis.", tissue: "bone" },
  { match: /coccyx/, meaning: "The tailbone at the tip of the spine.", tissue: "bone" },
  { match: /ilium/, meaning: "The broad upper wing of the hip bone.", tissue: "bone" },
  { match: /ischium/, meaning: "The lower back part of the hip bone you sit on.", tissue: "bone" },
  { match: /pubis/, meaning: "The front part of the hip bone.", tissue: "bone" },
  { match: /femur/, meaning: "The thigh bone.", tissue: "bone" },
  { match: /tibia/, meaning: "The shin bone.", tissue: "bone" },
  { match: /fibula/, meaning: "The slender bone beside the shin bone.", tissue: "bone" },
  { match: /patella/, meaning: "The kneecap.", tissue: "bone" },
  { match: /meniscus/, meaning: "A crescent of fibrocartilage that cushions the knee.", tissue: "cartilage" },
  { match: /articular cartilage/, meaning: "The smooth cartilage covering bone ends inside a joint.", tissue: "cartilage" },
  { match: /condyle|epicondyl|intercondylar|patellar surface|perichondular|enthesis|cruciate/, meaning: "A landmark on the bone surface where a joint or ligament attaches.", tissue: "bone" },
  { match: /nucleus pulposus/, meaning: "The soft gel core of an intervertebral disc.", tissue: "fluid" },
  { match: /intervertebral disk/, meaning: "The fibrocartilage pad between two vertebrae.", tissue: "cartilage" },

  // Skin patch
  { match: /epidermis/, meaning: "The outer layer of skin, made of keratinised cells.", tissue: "skin" },
  { match: /dermis/, meaning: "The thick living layer with vessels, nerves, and glands.", tissue: "skin" },
  { match: /subcutaneous/, meaning: "The fatty layer beneath the skin.", tissue: "gland" },
  { match: /adipose/, meaning: "Fat tissue that stores energy and insulates.", tissue: "gland" },
  { match: /hair follicle/, meaning: "The pocket from which a hair grows.", tissue: "skin" },
  { match: /hair shaft/, meaning: "The visible part of a hair.", tissue: "skin" },
  { match: /sweat gland/, meaning: "A coiled tube that releases sweat to cool the body.", tissue: "gland" },
];

const ordinals: Record<string, string> = {
  first: "1st", second: "2nd", third: "3rd", fourth: "4th", fifth: "5th", sixth: "6th", seventh: "7th",
  eighth: "8th", ninth: "9th", tenth: "10th", eleventh: "11th", twelfth: "12th",
};

const abbreviations: Record<string, string> = {
  hth: "hypothalamus",
  fugt: "fusiform gyrus",
  luq: "left upper quadrant",
  ruq: "right upper quadrant",
  sup: "superior",
  inf: "inferior",
};

/** Normalise a model identifier into lower-case words. */
export function normaliseStructureName(name: string) {
  return name
    .replace(/^(Allen|Yao|VIS|VHM|VHF|VH|BP3D)[_-]*(M|F)?[_-]*/i, "")
    .replace(/FBXASC032/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function stripSide(words: string): { text: string; side?: "left" | "right" } {
  const trailing = words.match(/\s(l|r)(?:\s[a-j])?$/);
  if (trailing) {
    const side = trailing[1] === "l" ? "left" : "right";
    return { text: words.replace(/\s(l|r)(\s[a-j])?$/, "$2"), side };
  }
  if (/^left\s/.test(words)) return { text: words, side: "left" };
  if (/^right\s/.test(words)) return { text: words, side: "right" };
  return { text: words };
}

function titleCase(text: string) {
  const cleaned = text
    .split(" ")
    .filter(Boolean)
    .map((word) => abbreviations[word] ?? ordinals[word] ?? word)
    .join(" ")
    .replace(/\bof the\b/g, "of the");
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/** Describe a mesh identifier from an HRA model. */
export function describeStructure(name: string): StructureInfo {
  const normalised = normaliseStructureName(name);
  const { text, side } = stripSide(normalised);
  const rule = rules.find((candidate) => candidate.match.test(text) || candidate.match.test(normalised));
  let label = titleCase(text);
  if (side && !/^(left|right)\b/i.test(label)) label = `${label} (${side})`;
  return {
    label,
    side,
    meaning: rule?.meaning,
    tissue: rule?.tissue,
  };
}

/** Group structures that share a label root, for the layer list. */
export function structureGroupKey(name: string) {
  const info = describeStructure(name);
  return info.label.replace(/\s\((left|right)\)$/, "").replace(/\s[a-j]$/, "");
}
