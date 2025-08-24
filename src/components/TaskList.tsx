"use client";
import { useEffect, useState } from "react";

type Task = {
  id: string; title: string; category?: string | null;
  status: "TODO"|"DOING"|"DONE"; pomodoros: number;
};

export default function TaskList({ checkinMode=false }: { checkinMode?: boolean }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  async function load(){ const r = await fetch("/api/tasks"); if(r.ok) setTasks(await r.json()); }
  useEffect(()=>{ load(); }, []);

  async function setStatus(id:string, status:Task["status"]) {
    const r = await fetch(`/api/tasks/${id}`, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ status })});
    if (r.ok) load();
  }
  async function remove(id:string) {
    if (!confirm("Hapus task?")) return;
    const r = await fetch(`/api/tasks/${id}`, { method:"DELETE" });
    if (r.ok) load();
  }

  const groups = {
    TODO: tasks.filter(t=>t.status==="TODO"),
    DOING: tasks.filter(t=>t.status==="DOING"),
    DONE: tasks.filter(t=>t.status==="DONE")
  };

  return (
    <div className="space-y-6">
      {["TODO","DOING","DONE"].map((k) => (
        <div key={k}>
          <h3 className="font-semibold mb-2">{k}</h3>
          <div className="grid gap-2">
            {groups[k as keyof typeof groups].map(t => (
              <div key={t.id} className="border rounded-xl p-3 flex items-center gap-3">
                {checkinMode ? (
                  <input type="checkbox" onChange={(e)=>setStatus(t.id, e.target.checked? "DONE":"TODO")}
                    defaultChecked={t.status==="DONE"} className="h-5 w-5" />
                ) : null}
                <div className="flex-1">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-gray-500">{t.category || "Umum"} • {t.pomodoros} Pomodoro</div>
                </div>
                {!checkinMode && (
                  <>
                    <select defaultValue={t.status} onChange={e=>setStatus(t.id, e.target.value as any)}
                      className="text-sm border rounded-lg px-2 py-1">
                      <option>TODO</option><option>DOING</option><option>DONE</option>
                    </select>
                    <button onClick={()=>remove(t.id)} className="text-sm text-red-600">Hapus</button>
                  </>
                )}
              </div>
            ))}
            {groups[k as keyof typeof groups].length===0 && <div className="text-sm text-gray-400">Tidak ada</div>}
          </div>
        </div>
      ))}
    </div>
  );
}