import type { Metadata } from "next";
import { Roboto, Open_Sans } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapHire",
  description: "An AI-Powered platform for preparing for interviews"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} bg-background antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
