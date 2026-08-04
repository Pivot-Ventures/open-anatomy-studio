# Open Anatomy Studio product strategy

## 中文

### 1. 对参考项目的判断

| 项目 | 值得学习 | 主要缺口 | 我们的处理 |
| --- | --- | --- | --- |
| `thebuggeddev/anatomy` | 视觉完成度高，原生 Three.js 对材质、剖切和加载过程有较强控制，GSAP 转场自然 | 仓库根目录未发现代码许可证；九个模型与插图缺少公开资产清单；单语；医学内容缺少逐层来源说明 | 只研究功能和交互，不复制代码、文案、图片或模型 |
| `cwsyym4/anatomy-atelier-clone` | 对 Bun、Spaces 和静态资产部署做了适配 | 与原项目的大部分产品代码相同；缺少独立产品方向和根许可证 | 不作为代码来源，只验证直接复刻容易积累的维护风险 |
| `tejasghalsasi/anatomy-atelier` | React Three Fiber 组件化清楚；13 个 HuBMAP 模型有 CC BY 4.0 说明；模型经过 Meshopt 压缩 | 项目标记为 backburner；根目录未发现代码许可证；所谓 cross-section 实际是半透明平面，不是真正的几何剖切 | 仅复用明确开放的 HRA 模型，重新实现代码和真实 clipping plane |

结论：更好的版本不能只是把米色界面换一种颜色。产品需要同时解决可信度、学习路径、可访问性、性能和许可追踪。

### 2. 产品定位

Open Anatomy Studio 是一个面向学生、教师和好奇用户的双语 3D 学习工作室，医学解剖是首个旗舰学科。首屏直接进入探索，不设置冗长营销页。平台把以下层次独立维护：

1. 学科、主题、课程与学习目标。
2. 3D 场景、对象与可验证任务。
3. 评估、内容来源、模型来源与审核状态。
4. 当前解剖旗舰使用的开放许可 HRA 模型和双语知识内容。

它不是临床诊断工具，也不尝试替代教材、医生或专业训练。

### 3. 当前版本的差异化

- 双语不是机器翻译覆盖层，而是类型化内容数据，器官、系统、事实、标注和测验都拥有中英文版本。
- 3D 交互包含旋转、缩放、自动旋转、模型对象点选、结构聚焦、语义对象名称和真正的材质剖切平面。
- 心脏试点已经把结构定位、剖切观察和快速测验连成可验证的三步导学闭环；其他器官仍以自由探索和单题测验为主。
- `app/lib/learning.ts` 已抽象学科、主题、课程、场景、对象、任务、评估和来源契约；当前仅医学解剖处于 active 状态。
- 可信层包含应用内来源抽屉、MIT 代码许可、CC BY 4.0 模型署名、第三方资产清单和医学免责声明。
- 性能层使用按需器官加载、只预取下一个模型、Meshopt 模型、自适应设备像素比、低分辨率动态阴影和 reduced-motion 兼容。
- 响应式策略在桌面将控制区约束在首屏内，在手机使用横向器官轨道、纵向学习内容和底部紧凑导航。
- WebGL 不可用时保留结构、事实、来源与课程内容，并用文字状态替代空白画布。

### 4. 技术架构

- Next.js 16 + React 19 + TypeScript
- vinext + Vite，用于本地与 Cloudflare 兼容构建
- React Three Fiber + Drei + Three.js
- 类型化本地双语解剖数据与通用学习内容契约，无账号和后端依赖
- `localStorage` 保存语言、主题、收藏和探索进度
- 12 个 HuBMAP HRA GLB 模型，加一个不含人物体态的本地程序化皮肤切面

### 5. 下一阶段优先级

P1 应聚焦内容可信度和模型语义：把心脏试点的事实级来源与审核字段扩展到全部器官，为模型 mesh 名称增加 UBERON / FMA 对照，并补充模型加载失败时的静态二维图。

P2 应完成第二学科试点，优先选择带参数变化或过程模拟的主题，以证明通用场景和任务模型不是解剖专用命名；随后再扩展系统级路径、间隔复习、教师演示模式、学习记录导出和 WCAG 人工审计。

P3 才考虑账户、云同步、协作笔记、内容后台或 AI 辅导。它们不应先于医学审核和来源粒度。

## English

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
