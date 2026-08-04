import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/HongChao6/open-anatomy-studio"),
  title: {
    default: "Open Anatomy Studio | 开放解剖工作室",
    template: "%s | Open Anatomy Studio",
  },
  description: "Explore human organs in 3D with bilingual explanations, learning tools, and auditable sources.",
  applicationName: "Open Anatomy Studio",
  authors: [{ name: "HongChao6", url: "https://github.com/HongChao6" }],
  keywords: ["anatomy", "3D", "education", "HuBMAP", "Human Reference Atlas", "解剖学", "三维学习"],
  openGraph: {
    type: "website",
    title: "Open Anatomy Studio",
    description: "A bilingual, source-aware 3D anatomy learning studio.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Open Anatomy Studio 3D organ explorer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Anatomy Studio",
    description: "A bilingual, source-aware 3D anatomy learning studio.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#071012" },
    { media: "(prefers-color-scheme: light)", color: "#edf2ef" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
