import { prisma } from "@/lib/db";
import webpush from "web-push";
import { morningAffirmations } from "@/lib/affirmations";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function GET() {
  const subs = await prisma.pushSubscription.findMany({ where: { morningOn: true } });
  const aff = morningAffirmations[Math.floor(Math.random() * morningAffirmations.length)];

  await Promise.allSettled(subs.map(async (s) => {
    const payload = JSON.stringify({
      title: "Selamat Pagi 👋",
      body: `${aff}\nCek jadwal & tugas hari ini.`,
      url: "/tasks?greeting=1"
    });
    try { await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload); }
    catch {}
  }));

  return Response.json({ ok: true, count: subs.length });
}