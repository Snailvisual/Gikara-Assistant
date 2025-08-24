import "./globals.css";
import { ReactNode, useEffect } from "react";
import Link from "next/link";

export const metadata = {
  title: "Pomodoro Planner",
  description: "Task + Pomodoro + Google Calendar"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-white text-black">
        <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
          <nav className="mx-auto max-w-3xl flex items-center gap-4 p-4">
            <Link href="/" className="font-semibold">Pomodoro Planner</Link>
            <div className="ml-auto flex gap-4 text-sm">
              <Link href="/tasks" className="hover:underline">Tugas</Link>
              <Link href="/calendar" className="hover:underline">Calendar</Link>
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl p-4">{children}</main>
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `
        }} />
      </body>
    </html>
  );
}