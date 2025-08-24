"use client";
import { useState } from "react";

export default function AddTaskDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [pomodoros, setPomodoros] = useState(1);

  async function submit() {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, pomodoros })
    });
    if (res.ok) {
      setTitle(""); setCategory(""); setPomodoros(1); setOpen(false); onCreated();
    } else alert("Gagal menambah task");
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="px-3 py-2 rounded-xl bg-black text-white">Tambah Task</button>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 w-full max-w-md space-y-3">
            <h3 className="font-semibold text-lg">Tambah Task</h3>
            <input value={title} onChange={e=>setTitle(e.target.value)}
              placeholder="Judul task" className="w-full border rounded-xl px-3 py-2" />
            <input value={category} onChange={e=>setCategory(e.target.value)}
              placeholder="Kategori (opsional)" className="w-full border rounded-xl px-3 py-2" />
            <label className="block text-sm">Pomodoro (25 menit): {pomodoros}</label>
            <input type="range" min={1} max={12} value={pomodoros}
              onChange={e=>setPomodoros(parseInt(e.target.value))}
              className="w-full" />
            <div className="flex gap-2 justify-end">
              <button onClick={()=>setOpen(false)} className="px-3 py-2 rounded-xl border">Batal</button>
              <button onClick={submit} className="px-3 py-2 rounded-xl bg-black text-white">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}