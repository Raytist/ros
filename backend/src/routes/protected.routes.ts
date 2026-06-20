import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authenticate, requireCandidate, requireRecruiter } from "../middleware/auth.js";
import {
  ADAPTIVE,
  adjustDifficulty,
  buildSessionResponse,
  computeResult,
  getTasksForAssessment,
} from "../services/assessment.service.js";
import {
  getCandidateProfile,
  getCandidates,
  getLeaderboard,
  getResults,
  updateProfileAfterResult,
} from "../services/profile.service.js";
import type { TaskAnswer } from "../types.js";

const startSchema = z.object({
  mode: z.enum(["global", "competency", "basic", "medium", "hard"]),
  topicId: z.string().optional(),
});

const answerSchema = z.object({
  answer: z.object({
    taskId: z.string(),
    value: z.unknown(),
    isCorrect: z.boolean(),
    timeSpent: z.number(),
    hintsUsed: z.number(),
  }),
});

export async function protectedRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);

  app.post("/assessment/start", { preHandler: requireCandidate }, async (request, reply) => {
    const body = startSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ code: "VALIDATION_ERROR", message: "Неверные данные" });
    }

    const userId = (request.user as { sub: string }).sub;
    const { mode, topicId } = body.data;
    const count = mode === "global" ? ADAPTIVE.maxQuestions : mode === "competency" ? 12 : 10;
    const tasks = getTasksForAssessment(mode, topicId, count);

    const session = await prisma.assessmentSession.create({
      data: {
        userId,
        mode,
        topicId,
        tasks: tasks as object[],
        answers: [],
        currentIndex: 0,
        difficulty: ADAPTIVE.initialDifficulty,
        status: "in_progress",
      },
    });

    return { session: buildSessionResponse(session) };
  });

  app.post<{ Params: { sessionId: string } }>(
    "/assessment/:sessionId/answer",
    { preHandler: requireCandidate },
    async (request, reply) => {
      const body = answerSchema.safeParse(request.body);
      if (!body.success) {
        return reply.status(400).send({ code: "VALIDATION_ERROR", message: "Неверные данные" });
      }

      const userId = (request.user as { sub: string }).sub;
      const session = await prisma.assessmentSession.findUnique({
        where: { id: request.params.sessionId },
      });

      if (!session || session.userId !== userId) {
        return reply.status(404).send({ code: "NOT_FOUND", message: "Сессия не найдена" });
      }

      const tasks = session.tasks as unknown as ReturnType<typeof getTasksForAssessment>;
      const answers = [...(session.answers as unknown as TaskAnswer[]), body.data.answer as TaskAnswer];
      const newDifficulty = adjustDifficulty(session.difficulty, body.data.answer.isCorrect);
      const nextIndex = session.currentIndex + 1;
      const maxQuestions =
        session.mode === "global" ? ADAPTIVE.maxQuestions : tasks.length;
      const isComplete = nextIndex >= maxQuestions || nextIndex >= tasks.length;

      const updated = await prisma.assessmentSession.update({
        where: { id: session.id },
        data: {
          answers: answers as object[],
          currentIndex: nextIndex,
          difficulty: newDifficulty,
          status: isComplete ? "completed" : "in_progress",
          completedAt: isComplete ? new Date() : null,
        },
      });

      return {
        session: buildSessionResponse(updated),
        nextTask: !isComplete ? tasks[nextIndex] : undefined,
        isComplete,
      };
    }
  );

  app.post<{ Params: { sessionId: string } }>(
    "/assessment/:sessionId/complete",
    { preHandler: requireCandidate },
    async (request, reply) => {
      const userId = (request.user as { sub: string }).sub;
      const session = await prisma.assessmentSession.findUnique({
        where: { id: request.params.sessionId },
      });

      if (!session || session.userId !== userId) {
        return reply.status(404).send({ code: "NOT_FOUND", message: "Сессия не найдена" });
      }

      const tasks = session.tasks as unknown as ReturnType<typeof getTasksForAssessment>;
      const answers = session.answers as unknown as TaskAnswer[];
      const resultData = computeResult(session, answers, tasks);

      const existing = await prisma.assessmentResult.findUnique({
        where: { sessionId: session.id },
      });

      if (existing) {
        return { result: resultData };
      }

      await prisma.assessmentResult.create({
        data: {
          sessionId: session.id,
          userId,
          mode: resultData.mode,
          topicId: resultData.topicId,
          globalGrade: resultData.globalGrade,
          competencyLevel: resultData.competencyLevel,
          skillScore: resultData.skillScore,
          accuracy: resultData.accuracy,
          avgResponseTime: resultData.avgResponseTime,
          errorCount: resultData.errorCount,
          hintsUsed: resultData.hintsUsed,
          confidenceLevel: resultData.confidenceLevel,
          competencyMap: resultData.competencyMap as unknown as object[],
          strengths: resultData.strengths as unknown as object[],
          weaknesses: resultData.weaknesses as unknown as object[],
          recommendations: resultData.recommendations as unknown as object[],
          aiSummary: resultData.aiSummary,
        },
      });

      await updateProfileAfterResult(userId, {
        globalGrade: resultData.globalGrade,
        skillScore: resultData.skillScore,
        accuracy: resultData.accuracy,
        avgResponseTime: resultData.avgResponseTime,
        errorCount: resultData.errorCount,
        hintsUsed: resultData.hintsUsed,
        confidenceLevel: resultData.confidenceLevel,
        competencyMap: resultData.competencyMap as Array<{
          topicId: string;
          score: number;
          level: string;
          medal?: string;
        }>,
      });

      return { result: resultData };
    }
  );

  app.get("/profile", { preHandler: requireCandidate }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub;
    const profile = await getCandidateProfile(userId);
    if (!profile) {
      return reply.status(404).send({ code: "NOT_FOUND", message: "Профиль не найден" });
    }
    return { profile };
  });

  app.get("/results", { preHandler: requireCandidate }, async (request) => {
    const userId = (request.user as { sub: string }).sub;
    const results = await getResults(userId);
    return { results };
  });

  app.get("/leaderboard", { preHandler: requireCandidate }, async (request) => {
    const userId = (request.user as { sub: string }).sub;
    return getLeaderboard(userId);
  });

  app.get("/recruiter/candidates", { preHandler: requireRecruiter }, async (request) => {
    const q = request.query as Record<string, string>;
    return getCandidates({
      grade: q.grade,
      topicId: q.topicId,
      medal: q.medal,
      minRating: q.minRating ? Number(q.minRating) : undefined,
      search: q.search,
    });
  });

  app.get<{ Params: { id: string } }>(
    "/recruiter/candidates/:id",
    { preHandler: requireRecruiter },
    async (request, reply) => {
      const profile = await getCandidateProfile(request.params.id);
      if (!profile) {
        return reply.status(404).send({ code: "NOT_FOUND", message: "Кандидат не найден" });
      }
      return { candidate: profile };
    }
  );
}
