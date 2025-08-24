"use client";
import { useEffect } from "react";
import AddTaskDialog from "@/components/AddTaskDialog";
import TaskList from "@/components/TaskList";
import EnablePush from "@/components/EnablePush";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const greeting = params.get("greeting") === "1";
  const checkin = params.get("checkin") === "1";

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.replace("/api/auth/signin");
  }, [session, status, router]);

  useEffect(()=>{
    if (greeting) {
      alert("Selamat pagi! Siap fokus 1 Pomodoro pertama? 💪");
    }
  }, [greeting]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tugas</h1>
        <EnablePush />
      </div>
      <AddTaskDialog onCreated={()=>{ location.reload(); }} />
      <div className="rounded-2xl border p-4">
        <TaskList checkinMode={checkin}/>
      </div>
      <div className="text-sm text-gray-500">Tip: gunakan status <b>DOING</b> saat sesi Pomodoro berjalan.</div>
    </div>
  );
}