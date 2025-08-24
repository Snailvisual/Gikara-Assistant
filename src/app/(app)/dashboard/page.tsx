import PodomoroStats from "../../../components/PodomoroStats";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <PodomoroStats />
      <div className="rounded-2xl border p-4">
        <h3 className="font-semibold mb-2">Pengelompokan Otomatis</h3>
        <p className="text-sm text-gray-600">Tugas diurutkan menjadi sesi Pomodoro (25′ fokus + 5′ break). Gunakan halaman Tugas untuk menandai progres.</p>
      </div>
    </div>
  );
}