import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/appcontext";
import { TopNav } from "@/components/topnav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Knowledge Hub",
  description: "Upload, index, and query your private knowledge with RAG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen text-slate-100`}
      >
        <AppProvider>
          <div className="app-shell">
            <TopNav />
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
