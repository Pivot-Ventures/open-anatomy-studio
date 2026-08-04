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

Open Anatomy Studio 是一个面向学生、教师和好奇用户的双语三维解剖学习工作台。首屏直接进入探索，不设置冗长营销页。每个器官由三个可以独立审计的层组成：

1. 开放许可的 HRA 三维模型。
2. 中英文结构与功能摘要。
3. 可追踪的来源、许可和医学边界。

它不是临床诊断工具，也不尝试替代教材、医生或专业训练。

### 3. 当前版本的差异化

- 双语不是机器翻译覆盖层，而是类型化内容数据，器官、系统、事实、标注和测验都拥有中英文版本。
- 3D 交互包含旋转、缩放、自动旋转、模型对象点选、结构聚焦、语义对象名称和真正的材质剖切平面。
- 学习闭环包含搜索、按系统筛选、收藏、本地进度、结构热点和单器官快速测验。
- 可信层包含应用内来源抽屉、MIT 代码许可、CC BY 4.0 模型署名、第三方资产清单和医学免责声明。
- 性能层使用按需器官加载、只预取下一个模型、Meshopt 模型、限制设备像素比和 reduced-motion 兼容。
- 响应式策略在桌面使用三栏工作台，在手机使用横向器官轨道和纵向学习内容，不把桌面栏位硬压到窄屏。

### 4. 技术架构

- Next.js 16 + React 19 + TypeScript
- vinext + Vite，用于本地与 Cloudflare 兼容构建
- React Three Fiber + Drei + Three.js
- 类型化本地双语数据，无账号和后端依赖
- `localStorage` 保存语言、主题、收藏和探索进度
- 10 个 HuBMAP HRA GLB 模型，总体积保持在轻量级静态站点可接受范围

### 5. 下一阶段优先级

P1 应聚焦内容可信度和模型语义：为模型 mesh 名称增加 UBERON / FMA 对照，为每条事实建立来源 ID，补充模型加载失败时的二维与文本降级视图。

P2 再扩展学习能力：系统级路径、间隔复习、教师演示模式、学习记录导出和 WCAG 人工审计。

P3 才考虑账户、云同步、协作笔记、内容后台或 AI 辅导。它们不应先于医学审核和来源粒度。

## English

### 1. Assessment of the references

The original project offers excellent visual polish and precise raw Three.js control, but its public repository does not include a root code license or a complete public asset ledger. The direct clone is useful evidence that deployment adaptation alone does not create a distinct product. The R3F based atelier has the strongest open asset story through HuBMAP CC BY 4.0 models, but its code is unlicensed at the root and its section feature is a translucent plane rather than geometric clipping.

Open Anatomy Studio therefore uses a clean-room implementation. It studies capabilities, not source expressions. Only clearly licensed Human Reference Atlas data is redistributed, with attribution and modification disclosure.

### 2. Product position

Open Anatomy Studio is a bilingual 3D anatomy learning workbench for students, educators, and curious learners. It opens directly into exploration. Each organ keeps model provenance, educational copy, and product behavior as separate auditable layers.

The application is educational only. It is not a diagnostic product and does not replace a textbook, clinician, or professional training.

### 3. What makes this version stronger

- Typed bilingual content across organs, systems, facts, labels, and quizzes.
- Real model interaction with selection, focus, semantic mesh names, and material clipping.
- A learning loop with search, system filters, favorites, local progress, hotspots, and quizzes.
- In-product provenance with source links, license boundaries, asset attribution, and a medical disclaimer.
- Progressive loading, next-model prefetch, Meshopt files, capped pixel density, and reduced motion behavior.
- A desktop workbench and a purpose-built mobile reading flow.

### 4. Roadmap

P1 should add ontology mapping, fact-level citations, a non-WebGL fallback, and manual accessibility review. P2 can add system courses, spaced review, classroom presentation, and exportable learning records. Accounts, cloud sync, collaborative notes, or AI tutoring belong in P3 after medical review and provenance are stronger.
