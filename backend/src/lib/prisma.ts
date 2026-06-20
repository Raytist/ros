import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "roseltorg-dev-secret-change-in-production",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
};
