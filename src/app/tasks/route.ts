import { prisma } from "../../lib/db";
import { getServerSession } from "next-auth";
// Ensure that '@/lib/auth' exists and exports 'authOptions'
// Update the import path if your authOptions are located elsewhere, for example:
import { authOptions } from "../../lib/auth";
// Or, if the file does not exist, create 'src/lib/auth.ts' and export 'authOptions' from it.
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().min(1),
  category: z.string().optional(),
  pomodoros: z.number().int().min(1).max(12).default(1),
  dueDate: z.string().datetime().optional()
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const tasks = await prisma.task.findMany({
    where: { userEmail: session.user.email },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }]
  });
  return Response.json(tasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const body = await req.json();
  const parsed = TaskSchema.safeParse(body);
  if (!parsed.success) return Response.json(parsed.error.flatten(), { status: 400 });

  const task = await prisma.task.create({
    data: {
      userEmail: session.user.email,
      title: parsed.data.title,
      category: parsed.data.category,
      pomodoros: parsed.data.pomodoros,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null
    }
  });
  return Response.json(task);
}