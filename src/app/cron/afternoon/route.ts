import { prisma } from "@/lib/db";
import webpush from "web-push";
webpush.setVapidDetails(process.env.VAPID_SUBJECT!, process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);

export const dynamic = "force-dynamic";

export async function GET() {
  const subs = await prisma.pushSubscription.findMany({ where: { afternoonOn: true } });
  const payload = JSON.stringify({
    title: "Check-in Siang ☀️",
    body: "Tandai tugas yang sudah progress/done. Tetap on track ya!",
    url: "/tasks?checkin=1"
  });
  await Promise.allSettled(subs.map(async (s: { endpoint: string; p256dh: string; auth: string }) => {
    try { await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload); } catch {}
  }));
  return Response.json({ ok: true, count: subs.length });
}