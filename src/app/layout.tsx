import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Working Capital Control | SME Finance MVP",
  description: "AR, collections, and cash planning control center for SMEs.",
};

import { FinanceProvider } from '@/context/FinanceContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} gradient-bg min-h-screen`}>
        <FinanceProvider>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col pl-64">
              <Header />
              <main className="p-8 mt-16 max-w-7xl mx-auto w-full">
                {children}
              </main>
            </div>
          </div>
        </FinanceProvider>
      </body>
    </html>
  );
}
