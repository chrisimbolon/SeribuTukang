import Navbar from "@/components/layout/Navbar";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SeribuTukang — Jasa Terpercaya di Sekitar Anda",
  description:
    "Platform marketplace jasa tukang terpercaya. " +
    "Temukan tukang profesional untuk plumbing, listrik, " +
    "cleaning, dan lebih banyak lagi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm">
              © 2026 SeribuTukang. Jasa terpercaya di sekitar Anda. 🇮🇩
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}