import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitandSleek Vector",
  description:
    "Frontier vector search for image similarity. Qdrant-compatible API. Owned by your team.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`${GeistSans.className} min-h-screen bg-ink text-mist antialiased`}>{children}</body>
    </html>
  );
}
