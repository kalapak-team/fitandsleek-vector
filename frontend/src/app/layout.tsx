import type { Metadata } from "next";
import { Space_Grotesk, Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "FitandSleek Vector — Custom Vector Database",
  description:
    "FitandSleek Vector is a custom Qdrant-compatible vector database for image similarity search, collections, payloads, and recommendations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
