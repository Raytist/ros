import { prisma } from "../lib/prisma.js";

const TOPIC_LABELS: Record<string, string> = {
  "44-fz": "44-ФЗ",
  methodology: "Методичка Росэлторг",
  "procurement-abc": "Азбука закупок",
  eetp: "Руководство пользователя ЕЭТП",
  "civil-code": "Гражданский кодекс",
  koap: "КоАП",
  "criminal-code": "УК РФ",
  "court-practice": "Судебная практика",
  fas: "Практика ФАС",
};

function mapResult(r: {
  sessionId: string;
  userId: string;
  mode: string;
  topicId: string | null;
  globalGrade: string | null;
  competencyLevel: string | null;
  skillScore: number;
  accuracy: number;
  avgResponseTime: number;
  errorCount: number;
  hintsUsed: number;
  confidenceLevel: number;
  competencyMap: unknown;
  strengths: unknown;
  weaknesses: unknown;
  recommendations: unknown;
  aiSummary: string;
  completedAt: Date;
}) {
  return {
    sessionId: r.sessionId,
    userId: r.userId,
    mode: r.mode,
    topicId: r.topicId ?? undefined,
    globalGrade: r.globalGrade ?? undefined,
    competencyLevel: r.competencyLevel ?? undefined,
    skillScore: r.skillScore,
    accuracy: r.accuracy,
    avgResponseTime: r.avgResponseTime,
    errorCount: r.errorCount,
    hintsUsed: r.hintsUsed,
    confidenceLevel: r.confidenceLevel,
    competencyMap: r.competencyMap,
    strengths: r.strengths,
    weaknesses: r.weaknesses,
    recommendations: r.recommendations,
    aiSummary: r.aiSummary,
    completedAt: r.completedAt.toISOString(),
  };
}

export async function getCandidateProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: { include: { competencies: true } },
      achievements: { include: { achievement: true } },
      results: { orderBy: { completedAt: "desc" }, take: 20 },
    },
  });

  if (!user?.profile) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organization: user.organization ?? undefined,
    createdAt: user.createdAt.toISOString(),
    globalGrade: user.profile.globalGrade,
    skillScore: user.profile.skillScore,
    rating: user.profile.rating,
    medalCount: user.profile.medalCount,
    competencies: user.profile.competencies.map((c) => ({
      topicId: c.topicId,
      score: c.score,
      level: c.level,
      medal: c.medal ?? undefined,
    })),
    achievements: user.achievements.map((ua) => ({
      id: ua.achievement.id,
      title: ua.achievement.title,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      unlockedAt: ua.unlockedAt.toISOString(),
    })),
    assessmentHistory: user.results.map(mapResult),
    analytics: user.profile.analyticsJson,
  };
}

export async function getResults(userId: string) {
  const results = await prisma.assessmentResult.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
  });
  return results.map(mapResult);
}

export async function getCandidates(filters: {
  grade?: string;
  topicId?: string;
  medal?: string;
  minRating?: number;
  search?: string;
}) {
  const profiles = await prisma.candidateProfile.findMany({
    include: {
      user: true,
      competencies: true,
    },
  });

  const withLastDate = await Promise.all(
    profiles.map(async (p) => {
      const last = await prisma.assessmentResult.findFirst({
        where: { userId: p.userId },
        orderBy: { completedAt: "desc" },
      });
      return {
        id: p.userId,
        name: p.user.name,
        globalGrade: p.globalGrade,
        skillScore: p.skillScore,
        medalCount: p.medalCount,
        lastAssessmentDate: last?.completedAt.toISOString() ?? p.user.createdAt.toISOString(),
        competencies: p.competencies.map((c) => ({
          topicId: c.topicId,
          score: c.score,
          level: c.level,
          medal: c.medal ?? undefined,
        })),
      };
    })
  );

  let candidates = withLastDate;

  if (filters.grade) {
    candidates = candidates.filter((c) => c.globalGrade === filters.grade);
  }
  if (filters.minRating) {
    candidates = candidates.filter((c) => c.skillScore >= filters.minRating!);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    candidates = candidates.filter((c) => c.name.toLowerCase().includes(q));
  }
  if (filters.topicId) {
    candidates = candidates.filter((c) =>
      c.competencies.some((comp) => comp.topicId === filters.topicId)
    );
  }
  if (filters.medal) {
    candidates = candidates.filter((c) =>
      c.competencies.some((comp) => comp.medal === filters.medal)
    );
  }

  return { candidates, total: candidates.length };
}

export async function getLeaderboard(currentUserId?: string) {
  const profiles = await prisma.candidateProfile.findMany({
    include: { user: true },
    orderBy: { skillScore: "desc" },
  });

  const entries = profiles.map((p, i) => ({
    rank: i + 1,
    userId: p.userId,
    name: p.user.name,
    skillScore: p.skillScore,
    globalGrade: p.globalGrade,
    medalCount: p.medalCount,
    streak: p.streak,
  }));

  const currentUserRank = currentUserId
    ? entries.find((e) => e.userId === currentUserId)?.rank
    : undefined;

  return { entries, currentUserRank };
}

export async function updateProfileAfterResult(
  userId: string,
  result: {
    globalGrade?: string;
    skillScore: number;
    accuracy: number;
    avgResponseTime: number;
    errorCount: number;
    hintsUsed: number;
    confidenceLevel: number;
    competencyMap: Array<{ topicId: string; score: number; level: string; medal?: string }>;
  }
) {
  const medalCount = result.competencyMap.filter((c) => c.medal).length;

  await prisma.candidateProfile.update({
    where: { userId },
    data: {
      skillScore: result.skillScore,
      globalGrade: (result.globalGrade as "intern" | "basic" | "expert") ?? undefined,
      medalCount,
      rating: Math.min(5, 3 + result.skillScore / 50),
      analyticsJson: {
        skillScore: result.skillScore,
        accuracy: result.accuracy,
        avgResponseTime: result.avgResponseTime,
        errorCount: result.errorCount,
        hintsUsed: result.hintsUsed,
        confidenceLevel: result.confidenceLevel,
        percentileRank: Math.min(99, result.skillScore),
        comparisonData: [
          { metric: "Балл компетенций", candidate: result.skillScore, average: 62 },
          { metric: "Точность", candidate: result.accuracy, average: 74 },
          { metric: "Скорость", candidate: Math.max(0, 100 - result.avgResponseTime), average: 65 },
          { metric: "Уверенность", candidate: result.confidenceLevel, average: 58 },
        ],
      },
    },
  });

  for (const comp of result.competencyMap) {
    await prisma.topicCompetency.upsert({
      where: { userId_topicId: { userId, topicId: comp.topicId } },
      create: {
        userId,
        topicId: comp.topicId,
        score: comp.score,
        level: comp.level,
        medal: comp.medal,
      },
      update: {
        score: comp.score,
        level: comp.level,
        medal: comp.medal,
      },
    });
  }
}

export { TOPIC_LABELS };
