import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

const topics = JSON.parse(readFileSync(join(__dirname, "../src/data/topics.json"), "utf-8"));
const tasks = JSON.parse(readFileSync(join(__dirname, "../src/data/tasks.json"), "utf-8"));

const users = [
  { id: "user-1", email: "anna.petrova@example.ru", name: "Анна Петрова", role: "candidate" as const },
  { id: "user-2", email: "recruiter@roseltorg.ru", name: "Игорь Смирнов", role: "recruiter" as const, organization: "Росэлторг" },
  { id: "user-3", email: "dmitry.volkov@example.ru", name: "Дмитрий Волков", role: "candidate" as const },
  { id: "user-4", email: "elena.kuznetsova@example.ru", name: "Елена Кузнецова", role: "candidate" as const },
  { id: "user-5", email: "sergey.orlov@example.ru", name: "Сергей Орлов", role: "candidate" as const },
];

const achievements = [
  { id: "ach-1", title: "Знаток 44-ФЗ", description: "Достигнут уровень Эксперт по 44-ФЗ", icon: "Award" },
  { id: "ach-2", title: "Эксперт ЕЭТП", description: "Золотая медаль по ЕЭТП", icon: "Monitor" },
  { id: "ach-3", title: "Мастер НМЦК", description: "10 расчётов НМЦК без ошибок", icon: "Calculator" },
  { id: "ach-4", title: "Эксперт ФАС", description: "Платиновая медаль по практике ФАС", icon: "Building2" },
  { id: "ach-5", title: "Юрист закупок", description: "Высокий балл по ГК РФ и судебной практике", icon: "Scale" },
  { id: "ach-6", title: "Без ошибок", description: "Пройти сессию без единой ошибки", icon: "CheckCircle" },
  { id: "ach-7", title: "100% результат", description: "Максимальный балл в тематической практике", icon: "Star" },
  { id: "ach-8", title: "Скоростной эксперт", description: "Среднее время ответа менее 30 секунд", icon: "Zap" },
];

const annaCompetencies = [
  { topicId: "44-fz", score: 95, level: "expert", medal: "platinum" },
  { topicId: "methodology", score: 80, level: "advanced", medal: "gold" },
  { topicId: "procurement-abc", score: 72, level: "basic", medal: "silver" },
  { topicId: "eetp", score: 92, level: "expert", medal: "gold" },
  { topicId: "civil-code", score: 60, level: "basic", medal: "silver" },
  { topicId: "koap", score: 40, level: "novice", medal: "bronze" },
  { topicId: "criminal-code", score: 35, level: "novice" },
  { topicId: "court-practice", score: 20, level: "novice", medal: "bronze" },
  { topicId: "fas", score: 55, level: "basic", medal: "bronze" },
];

const candidateSeeds = [
  {
    userId: "user-1",
    globalGrade: "expert" as const,
    skillScore: 87,
    rating: 4.8,
    medalCount: 6,
    streak: 7,
    competencies: annaCompetencies,
    achievementIds: ["ach-1", "ach-2", "ach-3", "ach-6", "ach-8"],
  },
  {
    userId: "user-3",
    globalGrade: "basic" as const,
    skillScore: 68,
    rating: 4.2,
    medalCount: 3,
    streak: 3,
    competencies: [
      { topicId: "44-fz", score: 75, level: "advanced", medal: "silver" },
      { topicId: "eetp", score: 70, level: "basic", medal: "bronze" },
      { topicId: "methodology", score: 60, level: "basic", medal: "bronze" },
    ],
    achievementIds: ["ach-1"],
  },
  {
    userId: "user-4",
    globalGrade: "expert" as const,
    skillScore: 91,
    rating: 4.9,
    medalCount: 8,
    streak: 14,
    competencies: [
      { topicId: "44-fz", score: 98, level: "expert", medal: "platinum" },
      { topicId: "fas", score: 88, level: "expert", medal: "gold" },
      { topicId: "court-practice", score: 85, level: "advanced", medal: "gold" },
    ],
    achievementIds: ["ach-1", "ach-2", "ach-4", "ach-7"],
  },
  {
    userId: "user-5",
    globalGrade: "intern" as const,
    skillScore: 45,
    rating: 3.5,
    medalCount: 1,
    streak: 1,
    competencies: [{ topicId: "procurement-abc", score: 50, level: "basic", medal: "bronze" }],
    achievementIds: [],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("demo", 10);

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { id: topic.id },
      create: topic,
      update: topic,
    });
  }

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.id },
      create: {
        id: task.id,
        topicId: task.topicId,
        type: task.type,
        difficulty: task.difficulty,
        title: task.title,
        instruction: task.instruction,
        content: task.content,
        source: task.source,
        timeLimit: task.timeLimit,
        hints: task.hints ?? null,
      },
      update: {
        type: task.type,
        difficulty: task.difficulty,
        title: task.title,
        instruction: task.instruction,
        content: task.content,
        source: task.source,
        timeLimit: task.timeLimit,
        hints: task.hints ?? null,
      },
    });
  }

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { id: ach.id },
      create: ach,
      update: ach,
    });
  }

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      create: {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        organization: u.organization,
        passwordHash,
      },
      update: {
        email: u.email,
        name: u.name,
        role: u.role,
        organization: u.organization,
        passwordHash,
      },
    });
  }

  for (const c of candidateSeeds) {
    await prisma.candidateProfile.upsert({
      where: { userId: c.userId },
      create: {
        userId: c.userId,
        globalGrade: c.globalGrade,
        skillScore: c.skillScore,
        rating: c.rating,
        medalCount: c.medalCount,
        streak: c.streak,
        analyticsJson: {
          skillScore: c.skillScore,
          accuracy: c.skillScore > 80 ? 91 : 74,
          avgResponseTime: 42,
          errorCount: 5,
          hintsUsed: 2,
          confidenceLevel: c.skillScore - 5,
          percentileRank: Math.min(99, c.skillScore),
          comparisonData: [
            { metric: "Балл компетенций", candidate: c.skillScore, average: 62 },
            { metric: "Точность", candidate: c.skillScore > 80 ? 91 : 74, average: 74 },
            { metric: "Скорость", candidate: 78, average: 65 },
            { metric: "Уверенность", candidate: c.skillScore - 5, average: 58 },
          ],
        },
      },
      update: {
        globalGrade: c.globalGrade,
        skillScore: c.skillScore,
        rating: c.rating,
        medalCount: c.medalCount,
        streak: c.streak,
      },
    });

    for (const comp of c.competencies) {
      await prisma.topicCompetency.upsert({
        where: { userId_topicId: { userId: c.userId, topicId: comp.topicId } },
        create: { userId: c.userId, ...comp },
        update: comp,
      });
    }

    for (const achId of c.achievementIds) {
      await prisma.userAchievement.upsert({
        where: { userId_achievementId: { userId: c.userId, achievementId: achId } },
        create: {
          userId: c.userId,
          achievementId: achId,
          unlockedAt: new Date("2026-01-15"),
        },
        update: {},
      });
    }
  }

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
