import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "SnapHire - AI-Powered Interview Practice Platform",
    template: "%s | SnapHire",
  },
  description:
    "Master your interview skills with SnapHire's AI-powered mock interviews. Get personalized feedback, expert insights, and improve your chances of landing your dream job.",
  keywords: [
    "interview practice",
    "AI interview",
    "mock interview",
    "job preparation",
    "career development",
    "interview skills",
    "interview feedback",
    "technical interview",
    "behavioral interview",
  ],
  metadataBase: new URL("https://snaphire.pro"),
  authors: [{ name: "SnapHire Team", url: "https://snaphire.pro" }],
  creator: "SnapHire",
  publisher: "SnapHire",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "https://snaphire.pro/favicon.ico", sizes: "any" },
      { url: "https://snaphire.pro/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "https://snaphire.pro/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "https://snaphire.pro/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [{ rel: "manifest", url: "https://snaphire.pro/site.webmanifest" }],
  },
  openGraph: {
    type: "website",
    title: "SnapHire - AI-Powered Interview Practice Platform",
    description:
      "Master your interview skills with SnapHire's AI-powered mock interviews. Get personalized feedback and ace your next job interview.",
    url: "https://snaphire.pro",
    siteName: "SnapHire",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SnapHire - AI-Powered Interview Practice Platform",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapHire - AI-Powered Interview Practice Platform",
    site: "@snaphire",
    creator: "@snaphire",
    description:
      "Master your interview skills with SnapHire's AI-powered platform",
    images: ["https://snaphire.pro/favicon-32x32.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
