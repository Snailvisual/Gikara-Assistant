// src/components/PomodoroStats.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
type Task = { id:string; title:string; status:"TODO"|"DOING"|"DONE"; pomodoros:number; category?:string|null };
export default function PomodoroStats() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(()=>{ (async()=>{ const r=await fetch("/api/tasks"); if(r.ok) setTasks(await r.json()); })(); }, []);
  const totals = useMemo(()=>{
    const all = tasks.reduce((a,t)=>a+t.pomodoros,0);
    const done = tasks.filter(t=>t.status==="DONE").reduce((a,t)=>a+t.pomodoros,0);
    return { all, done, todo: all-done };
  }, [tasks]);
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card label="Total Pomodoro" value={totals.all}/>
      <Card label="Selesai" value={totals.done}/>
      <Card label="Sisa" value={totals.todo}/>
    </div>
  );
}
function Card({label,value}:{label:string;value:number}) {
  return <div className="rounded-2xl border p-4"><div className="text-sm text-gray-500">{label}</div><div className="text-2xl font-semibold">{value}</div></div>;
}