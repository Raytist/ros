import type { CompetencyLevel, GlobalGrade, MedalTier, TopicId } from "@/types";

export const APP_NAME = "Росэлторг";
export const APP_SECTION = "Кандидаты";
export const APP_TAGLINE = "Проверьте знания и подтвердите квалификацию в госзакупках";

export const GLOBAL_GRADE_LABELS: Record<GlobalGrade, string> = {
  intern: "Стажёр",
  basic: "Базовый специалист",
  expert: "Эксперт",
};

export const COMPETENCY_LEVEL_LABELS: Record<CompetencyLevel, string> = {
  novice: "Новичок",
  basic: "Базовый",
  advanced: "Продвинутый",
  expert: "Эксперт",
};

export const MEDAL_LABELS: Record<MedalTier, string> = {
  bronze: "Бронза",
  silver: "Серебро",
  gold: "Золото",
  platinum: "Платина",
};

export const TOPIC_LABELS: Record<TopicId, string> = {
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

export const ADAPTIVE_CONFIG = {
  minQuestions: 15,
  maxQuestions: 20,
  initialDifficulty: 2,
  minDifficulty: 1,
  maxDifficulty: 4,
} as const;

export const ASSESSMENT_MODES = {
  global: "Определение профессионального уровня",
  competency: "Проверка компетенции",
  basic: "Базовый уровень",
  medium: "Средний уровень",
  hard: "Сложный уровень",
} as const;

export const LABELS = {
  skillScore: "Балл компетенций",
  accuracy: "Точность",
  avgTime: "Среднее время ответа",
  aiSummary: "Заключение системы",
  percentile: "Перцентиль",
} as const;
