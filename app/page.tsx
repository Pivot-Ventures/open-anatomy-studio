import type { Metadata } from "next";
import { AnatomyStudio } from "./components/AnatomyStudio";

export const metadata: Metadata = {
  title: "Open Anatomy Studio | 开放解剖工作室",
  description: "A bilingual, source-aware 3D anatomy explorer built with open Human Reference Atlas models.",
  other: {
    "codex-preview": "development",
  },
};

export default function Home() {
  return <AnatomyStudio />;
}
