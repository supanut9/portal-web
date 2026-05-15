import "./globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Portal",
  description: "Your launcher for the supanut9 platform.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("h-full antialiased", geist.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
