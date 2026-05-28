import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biblioteca Digital",
  description: "Sistema de gerenciamento de biblioteca",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 antialiased">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}