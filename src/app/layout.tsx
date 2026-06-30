import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banco de Querys",
  description: "Banco de querys SQL com busca por IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="max-w-4xl mx-auto px-4 py-3 flex gap-6 items-center">
            <span className="font-semibold">Banco de Querys</span>
            <Link href="/" className="text-sm hover:underline">
              Índice
            </Link>
            <Link href="/chat" className="text-sm hover:underline">
              Chat com IA
            </Link>
            <Link href="/nova" className="text-sm hover:underline">
              Nova query
            </Link>
          </nav>
        </header>
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
