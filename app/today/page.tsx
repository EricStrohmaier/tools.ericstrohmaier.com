import { WeekView } from "@/components/week-view";
import { JetBrains_Mono } from "next/font/google";
import { Metadata } from "next";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Focus Today",
  description: "Plan and track your daily focus tasks",
};

export default function TodayPage() {
  return (
    <main
      className={`${jetbrainsMono.variable} min-h-screen flex flex-col items-center justify-center p-4 md:p-6 dark font-mono bg-[#1e1e1e]`}
    >
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-300 tracking-tight mb-2">
            Focus Today
          </h1>
          <p className="text-gray-400">One project, one task, maximum focus</p>
        </header>

        <WeekView />
      </div>
    </main>
  );
}
