import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
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
    <html lang="en">
      <body className={`${roboto.className} bg-background antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
