"use client";
import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]|null>(null);
  const [error, setError] = useState<string|null>(null);

  useEffect(()=>{
    (async ()=>{
      const r = await fetch("/api/calendar/today");
      if (!r.ok) { setError("Perlu login Google. Klik 'Sign in' di pojok kanan atas halaman /api/auth/signin"); return; }
      setEvents(await r.json());
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Calendar Hari Ini</h1>
      {error && <div className="text-red-600">{error}</div>}
      {!events ? <div className="text-gray-500">Memuat...</div> : (
        <div className="space-y-2">
          {events.length===0 && <div className="text-gray-500">Tidak ada event hari ini.</div>}
          {events.map((e)=>(
            <div key={e.id} className="border rounded-xl p-3">
              <div className="font-medium">{e.summary || "(Tanpa judul)"}</div>
              <div className="text-sm text-gray-600">{renderTime(e.start?.dateTime || e.start?.date)} — {renderTime(e.end?.dateTime || e.end?.date)}</div>
              {e.location && <div className="text-sm">{e.location}</div>}
            </div>
          ))}
        </div>
      )}
      <a href="/api/auth/signin" className="text-sm underline">Sign in / switch akun Google</a>
    </div>
  );
}

function renderTime(s?:string) {
  if (!s) return "";
  const d = new Date(s);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}