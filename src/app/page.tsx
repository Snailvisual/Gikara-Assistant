import Link from "next/link";
export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Selamat datang 👋</h1>
      <p className="text-gray-600">Kelola tugas dengan Pomodoro, sinkron jadwal Google Calendar, dan notifikasi pagi/siang/malam.</p>
      <div className="flex gap-3">
        <Link href="/tasks" className="px-4 py-2 rounded-xl bg-black text-white">Mulai dari Tugas</Link>
        <Link href="/calendar" className="px-4 py-2 rounded-xl border">Lihat Calendar</Link>
      </div>
    </div>
  );
}