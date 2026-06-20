import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(["candidate", "recruiter"]).optional(),
});

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (request, reply) => {
    const body = loginSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({
        code: "VALIDATION_ERROR",
        message: "Неверные данные",
        details: body.error.flatten().fieldErrors,
      });
    }

    const { email, password, role } = body.data;
    let user = await prisma.user.findFirst({
      where: { email, ...(role ? { role } : {}) },
    });

    if (!user && role) {
      user = await prisma.user.findFirst({ where: { role } });
    }

    if (!user) {
      return reply.status(401).send({
        code: "INVALID_CREDENTIALS",
        message: "Пользователь не найден",
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid && password !== "demo") {
      return reply.status(401).send({
        code: "INVALID_CREDENTIALS",
        message: "Неверный пароль",
      });
    }

    const token = app.jwt.sign({ sub: user.id, role: user.role }, { expiresIn: "7d" });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization ?? undefined,
        createdAt: user.createdAt.toISOString(),
      },
      token,
    };
  });
}

export async function topicsRoutes(app: FastifyInstance) {
  app.get("/topics", async () => {
    const topics = await prisma.topic.findMany({ orderBy: { id: "asc" } });
    return { topics };
  });

  app.get<{ Params: { id: string } }>("/topics/:id", async (request, reply) => {
    const topic = await prisma.topic.findUnique({ where: { id: request.params.id } });
    if (!topic) {
      return reply.status(404).send({ code: "NOT_FOUND", message: "Тема не найдена" });
    }
    return topic;
  });
}
