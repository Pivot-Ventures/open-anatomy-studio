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
  metadataBase: new URL("https://easi.pivotventures.tech/atlas/organs/"),
  title: {
    default: "Human Atlas Organ Studio",
    template: "%s | Human Atlas Organ Studio",
  },
  description: "Explore human organs in 3D with named structures, descriptive terms, guided lessons, and auditable sources.",
  applicationName: "Human Atlas Organ Studio",
  keywords: ["anatomy", "3D", "education", "HuBMAP", "Human Reference Atlas", "EASI", "NCDC biology"],
  openGraph: {
    type: "website",
    title: "Human Atlas Organ Studio",
    description: "A source-aware 3D anatomy learning studio for schools.",
    images: [{ url: "og.png", width: 1200, height: 630, alt: "Human Atlas Organ Studio 3D organ explorer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Human Atlas Organ Studio",
    description: "A source-aware 3D anatomy learning studio for schools.",
    images: ["og.png"],
  },
  icons: {
    icon: "favicon.svg",
    shortcut: "favicon.svg",
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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
