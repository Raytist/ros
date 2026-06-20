import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { config, prisma } from "./lib/prisma.js";
import { authRoutes, topicsRoutes } from "./routes/public.routes.js";
import { protectedRoutes } from "./routes/protected.routes.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
  });

  await app.register(jwt, { secret: config.jwtSecret });

  app.get("/health", async () => ({ status: "ok" }));

  await app.register(async (api) => {
    await api.register(async (publicApi) => {
      await authRoutes(publicApi);
      await topicsRoutes(publicApi);
    });

    await api.register(async (privateApi) => {
      await protectedRoutes(privateApi);
    });
  }, { prefix: "/api/v1" });

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
}

async function main() {
  const app = await buildApp();
  await app.listen({ port: config.port, host: "0.0.0.0" });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
