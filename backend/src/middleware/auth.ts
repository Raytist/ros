import type { FastifyReply, FastifyRequest } from "fastify";

export interface JwtPayload {
  sub: string;
  role: "candidate" | "recruiter";
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify<JwtPayload>();
  } catch {
    return reply.status(401).send({
      code: "UNAUTHORIZED",
      message: "Требуется авторизация",
    });
  }
}

export async function requireRecruiter(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as JwtPayload;
  if (user.role !== "recruiter") {
    return reply.status(403).send({
      code: "FORBIDDEN",
      message: "Доступ только для рекрутера",
    });
  }
}

export async function requireCandidate(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as JwtPayload;
  if (user.role !== "candidate") {
    return reply.status(403).send({
      code: "FORBIDDEN",
      message: "Доступ только для кандидата",
    });
  }
}
