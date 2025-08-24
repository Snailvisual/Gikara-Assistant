import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const { subscription, prefs } = await req.json(); // { endpoint, keys:{p256dh,auth} }, prefs {morningOn,afternoonOn,eveningOn}
  const { endpoint, keys } = subscription || {};

  if (!endpoint || !keys?.p256dh || !keys?.auth)
    return new Response("Bad subscription", { status: 400 });

  const upserted = await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: {
      userEmail: session.user.email,
      p256dh: keys.p256dh,
      auth: keys.auth,
      morningOn: prefs?.morningOn ?? true,
      afternoonOn: prefs?.afternoonOn ?? true,
      eveningOn: prefs?.eveningOn ?? true
    },
    create: {
      userEmail: session.user.email,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      morningOn: prefs?.morningOn ?? true,
      afternoonOn: prefs?.afternoonOn ?? true,
      eveningOn: prefs?.eveningOn ?? true
    }
  });

  return Response.json({ ok: true, id: upserted.id, publicKey: process.env.VAPID_PUBLIC_KEY });
}