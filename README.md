# Open Anatomy Studio / 开放解剖工作室

A bilingual, source-aware 3D anatomy learning workbench built as a clean-room implementation.

一个面向学习者的中英双语三维解剖工作台，采用 clean-room 源码实现，并在产品内明确展示模型来源、许可与医学边界。

## Highlights / 核心能力

- 10 optimized Human Reference Atlas organ models under CC BY 4.0
- Chinese and English content, labels, filters, facts, and quizzes
- Rotate, zoom, auto rotate, semantic mesh selection, focus, labels, and real clipping planes
- Search, system filters, favorites, local progress, theme switch, and reduced-motion support
- In-product sources, attribution, code license, and educational disclaimer
- 10 个经过优化的 Human Reference Atlas 器官模型
- 中英双语器官、系统、标注、事实与测验
- 旋转、缩放、自动旋转、模型对象点选、结构聚焦、标注和真实剖切
- 搜索、系统筛选、收藏、本地进度、明暗主题与低动态支持

## Local development / 本地开发

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Quality checks:

```bash
npm run check
npm run build
```

## Architecture / 架构

- Next.js 16, React 19, TypeScript
- vinext, Vite, Cloudflare-compatible worker output
- Three.js, React Three Fiber, Drei
- Typed local bilingual content
- Local-only settings, favorites, and progress

The detailed product and competitor analysis is in [docs/PRODUCT_STRATEGY.md](docs/PRODUCT_STRATEGY.md).

完整产品判断、参考项目分析与路线图见 [docs/PRODUCT_STRATEGY.md](docs/PRODUCT_STRATEGY.md)。

## Licenses / 许可

Source code is MIT licensed. The 3D models are third-party Human Reference Atlas data under CC BY 4.0. See [THIRD_PARTY_ASSETS.md](THIRD_PARTY_ASSETS.md) for provenance, modification disclosure, and citation.

源码采用 MIT 许可。三维模型属于 Human Reference Atlas 的第三方数据，采用 CC BY 4.0。详细来源、修改说明与引用方式见 [THIRD_PARTY_ASSETS.md](THIRD_PARTY_ASSETS.md)。

This application is for anatomy learning only and is not medical advice.

本应用仅用于解剖学习，不构成医学建议。
