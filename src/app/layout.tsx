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
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
          <nav className="max-w-4xl mx-auto px-4 py-4 flex gap-6 items-center">
            <span className="font-bold text-lg tracking-tight text-slate-900">
              📚 Banco de Querys
            </span>
            <div className="flex gap-1 ml-auto">
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md px-3 py-1.5 transition-colors"
              >
                Índice
              </Link>
              <Link
                href="/chat"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md px-3 py-1.5 transition-colors"
              >
                Chat com IA
              </Link>
              <Link
                href="/nova"
                className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-700 rounded-md px-3 py-1.5 transition-colors"
              >
                + Nova query
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
