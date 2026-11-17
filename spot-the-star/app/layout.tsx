import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: "Spot the Star — Recruiter 2031 | Can you out-hire the AI?",
  description: "A 6-minute hiring simulation. Pick the best hire, catch the red flags the AI missed, and get your Recruiter DNA Report. By Scrini AI.",
  openGraph: { title: "Spot the Star — Recruiter 2031", description: "Can you out-hire the AI?", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#05060f", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased bg-office">{children}</body>
    </html>
  );
}
