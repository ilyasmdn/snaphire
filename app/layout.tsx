import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SnapHire - AI-Powered Interview Practice",
    template: "%s | SnapHire",
  },
  description:
    "Master your interview skills with SnapHire's AI-powered platform. Get real-time feedback and improve your chances of landing your dream job.",
  keywords: [
    "interview practice",
    "AI interview",
    "job preparation",
    "career development",
    "interview skills",
  ],
  metadataBase: new URL("https://snaphire.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  openGraph: {
    type: "website",
    title: "SnapHire - AI-Powered Interview Practice",
    description:
      "Master your interview skills with SnapHire's AI-powered platform",
    images: [
      {
        url: "/favicon-32x32.png",
        width: 1200,
        height: 630,
        alt: "SnapHire - AI-Powered Interview Practice Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapHire - AI-Powered Interview Practice",
    description:
      "Master your interview skills with SnapHire's AI-powered platform",
    images: ["/favicon-32x32.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <body className="bg-background antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
