import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const body = await req.json(); // can include status/title/category/pomodoros
  const task = await prisma.task.update({
    where: { id: params.id },
    data: { ...body }
  });
  return Response.json(task);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  await prisma.task.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}