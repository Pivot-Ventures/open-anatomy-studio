import type { Metadata } from "next";
import { AnatomyStudio } from "./components/AnatomyStudio";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: "Human Atlas Organ Studio" },
  description: "A source-aware 3D organ explorer built with open Human Reference Atlas models, with named structures and descriptive terms for every part.",
  other: {
    "codex-preview": "development",
  },
};

export default function Home() {
  return <AnatomyStudio />;
}
