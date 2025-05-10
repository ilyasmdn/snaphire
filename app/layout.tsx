import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Head from "next/head";

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
  openGraph: {
    type: "website",
    title: "SnapHire - AI-Powered Interview Practice",
    description:
      "Master your interview skills with SnapHire's AI-powered platform",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className="bg-background antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
      <Analytics/>
      <SpeedInsights/>
    </html>
  );
}
