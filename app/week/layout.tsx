"use client";

import { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function WeekLayout({ children }: { children: ReactNode }) {
  return (
    <main
      className={`${jetbrainsMono.variable} min-h-screen flex flex-col items-center justify-center p-4 md:p-6 dark font-mono bg-[#1e1e1e]`}
    >
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-300 tracking-tight mb-2">
            Weekly Focus
          </h1>
          <p className="text-gray-400">Plan your week for maximum productivity</p>
        </header>

        {children}
      </div>
    </main>
  );
}
