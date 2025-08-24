import { prisma } from "@/lib/db";
import webpush from "web-push";
import { eveningAffirmations } from "@/lib/affirmations";
webpush.setVapidDetails(process.env.VAPID_SUBJECT!, process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);

export async function GET() {
  const subs = await prisma.pushSubscription.findMany({ where: { eveningOn: true } });
  const aff = eveningAffirmations[Math.floor(Math.random() * eveningAffirmations.length)];
  const payload = JSON.stringify({
    title: "Penutup Malam 🌙",
    body: `Apa saja yang selesai hari ini? ${aff}`,
    url: "/dashboard"
  });
  await Promise.allSettled(subs.map(async (s) => {
    try { await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload); } catch {}
  }));
  return Response.json({ ok: true, count: subs.length });
}