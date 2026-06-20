import type { Achievement, CandidateListItem, CandidateProfile, LeaderboardEntry, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "anna.petrova@example.ru",
    name: "Анна Петрова",
    role: "candidate",
    createdAt: "2025-09-15T10:00:00Z",
  },
  {
    id: "user-2",
    email: "recruiter@roseltorg.ru",
    name: "Игорь Смирнов",
    role: "recruiter",
    organization: "Росэлторг",
    createdAt: "2025-08-01T09:00:00Z",
  },
  {
    id: "user-3",
    email: "dmitry.volkov@example.ru",
    name: "Дмитрий Волков",
    role: "candidate",
    createdAt: "2025-10-20T14:00:00Z",
  },
  {
    id: "user-4",
    email: "elena.kuznetsova@example.ru",
    name: "Елена Кузнецова",
    role: "candidate",
    createdAt: "2025-11-05T11:00:00Z",
  },
  {
    id: "user-5",
    email: "sergey.orlov@example.ru",
    name: "Сергей Орлов",
    role: "candidate",
    createdAt: "2025-12-01T08:30:00Z",
  },
];

export const mockAchievements: Achievement[] = [
  { id: "ach-1", title: "Знаток 44-ФЗ", description: "Достигнут уровень Эксперт по 44-ФЗ", icon: "Award", unlockedAt: "2026-01-15T12:00:00Z" },
  { id: "ach-2", title: "Эксперт ЕЭТП", description: "Золотая медаль по ЕЭТП", icon: "Monitor", unlockedAt: "2026-02-01T10:00:00Z" },
  { id: "ach-3", title: "Мастер НМЦК", description: "10 расчётов НМЦК без ошибок", icon: "Calculator", unlockedAt: "2026-02-10T14:00:00Z" },
  { id: "ach-4", title: "Эксперт ФАС", description: "Платиновая медаль по практике ФАС", icon: "Building2" },
  { id: "ach-5", title: "Юрист закупок", description: "Высокий балл по ГК РФ и судебной практике", icon: "Scale" },
  { id: "ach-6", title: "Без ошибок", description: "Пройти сессию без единой ошибки", icon: "CheckCircle", unlockedAt: "2026-01-20T16:00:00Z" },
  { id: "ach-7", title: "100% результат", description: "Максимальный балл в тематической практике", icon: "Star" },
  { id: "ach-8", title: "Скоростной эксперт", description: "Среднее время ответа менее 30 секунд", icon: "Zap", unlockedAt: "2026-03-01T09:00:00Z" },
];

export const mockCandidateProfile: CandidateProfile = {
  ...mockUsers[0],
  globalGrade: "expert",
  skillScore: 87,
  rating: 4.8,
  medalCount: 6,
  competencies: [
    { topicId: "44-fz", score: 95, level: "expert", medal: "platinum" },
    { topicId: "methodology", score: 80, level: "advanced", medal: "gold" },
    { topicId: "procurement-abc", score: 72, level: "basic", medal: "silver" },
    { topicId: "eetp", score: 92, level: "expert", medal: "gold" },
    { topicId: "civil-code", score: 60, level: "basic", medal: "silver" },
    { topicId: "koap", score: 40, level: "novice", medal: "bronze" },
    { topicId: "criminal-code", score: 35, level: "novice" },
    { topicId: "court-practice", score: 20, level: "novice", medal: "bronze" },
    { topicId: "fas", score: 55, level: "basic", medal: "bronze" },
  ],
  achievements: mockAchievements.filter((a) => a.unlockedAt),
  assessmentHistory: [],
  analytics: {
    skillScore: 87,
    accuracy: 91,
    avgResponseTime: 42,
    errorCount: 12,
    hintsUsed: 3,
    confidenceLevel: 85,
    percentileRank: 92,
    comparisonData: [
      { metric: "Балл компетенций", candidate: 87, average: 62 },
      { metric: "Точность", candidate: 91, average: 74 },
      { metric: "Скорость", candidate: 78, average: 65 },
      { metric: "Уверенность", candidate: 85, average: 58 },
    ],
  },
};

export const mockCandidates: CandidateListItem[] = [
  {
    id: "user-1",
    name: "Анна Петрова",
    globalGrade: "expert",
    skillScore: 87,
    medalCount: 6,
    lastAssessmentDate: "2026-06-15T10:00:00Z",
    competencies: mockCandidateProfile.competencies,
  },
  {
    id: "user-3",
    name: "Дмитрий Волков",
    globalGrade: "basic",
    skillScore: 68,
    medalCount: 3,
    lastAssessmentDate: "2026-06-10T14:30:00Z",
    competencies: [
      { topicId: "44-fz", score: 75, level: "advanced", medal: "silver" },
      { topicId: "eetp", score: 70, level: "basic", medal: "bronze" },
      { topicId: "methodology", score: 60, level: "basic", medal: "bronze" },
    ],
  },
  {
    id: "user-4",
    name: "Елена Кузнецова",
    globalGrade: "expert",
    skillScore: 91,
    medalCount: 8,
    lastAssessmentDate: "2026-06-18T09:15:00Z",
    competencies: [
      { topicId: "44-fz", score: 98, level: "expert", medal: "platinum" },
      { topicId: "fas", score: 88, level: "expert", medal: "gold" },
      { topicId: "court-practice", score: 85, level: "advanced", medal: "gold" },
    ],
  },
  {
    id: "user-5",
    name: "Сергей Орлов",
    globalGrade: "intern",
    skillScore: 45,
    medalCount: 1,
    lastAssessmentDate: "2026-06-05T16:00:00Z",
    competencies: [
      { topicId: "procurement-abc", score: 50, level: "basic", medal: "bronze" },
    ],
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: "user-4", name: "Елена Кузнецова", skillScore: 91, globalGrade: "expert", medalCount: 8, streak: 14 },
  { rank: 2, userId: "user-1", name: "Анна Петрова", skillScore: 87, globalGrade: "expert", medalCount: 6, streak: 7 },
  { rank: 3, userId: "user-3", name: "Дмитрий Волков", skillScore: 68, globalGrade: "basic", medalCount: 3, streak: 3 },
  { rank: 4, userId: "user-5", name: "Сергей Орлов", skillScore: 45, globalGrade: "intern", medalCount: 1, streak: 1 },
];
