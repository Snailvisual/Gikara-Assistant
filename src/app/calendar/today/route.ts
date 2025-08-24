import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchTodayEvents } from "@/lib/google";
import { DEFAULT_TZ } from "@/lib/timezone";

export async function GET() {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken as string | undefined;
  if (!accessToken) return new Response("Unauthorized", { status: 401 });
  const events = await fetchTodayEvents(accessToken, DEFAULT_TZ);
  return Response.json(events);
}