# Roadmap — РосКомпетенции

## Phase 1 — MVP (текущий) ✅

- [x] Landing + Login
- [x] Dashboard кандидата
- [x] Общий адаптивный тест (15-20 заданий)
- [x] 9 тематических направлений
- [x] 4 режима тестов по теме
- [x] 9 типов игровых заданий
- [x] Карта компетенций (radar, bar, heatmap)
- [x] Медали и достижения
- [x] Кабинет рекрутера + фильтры
- [x] AI-заключение (mock)
- [x] Leaderboard
- [x] Mock API + Zustand + React Query

## Phase 2 — Backend Integration (Q3 2026)

- [ ] PostgreSQL + Prisma/Drizzle ORM
- [ ] REST API (NestJS/FastAPI)
- [ ] JWT/OAuth2 авторизация (Keycloak)
- [ ] Real adaptive algorithm (IRT/CAT)
- [ ] Persistence результатов
- [ ] Admin panel для управления заданиями

## Phase 3 — Content & AI (Q4 2026)

- [ ] CMS для заданий (редактор кейсов)
- [ ] 500+ заданий по всем темам
- [ ] LLM-генерация AI-заключений
- [ ] LLM-генерация рекомендаций
- [ ] Импорт нормативной базы (44-ФЗ, ГК РФ)
- [ ] Автообновление при изменении законодательства

## Phase 4 — Enterprise (2027)

- [ ] Интеграция с HR-системами (HH.ru, SAP)
- [ ] SSO для госучреждений
- [ ] White-label для регионов
- [ ] Сертификаты PDF с QR-верификацией
- [ ] API для работодателей
- [ ] Proctoring (видеоконтроль)
- [ ] Mobile app (React Native)

## Phase 5 — Gamification & Community

- [ ] Ежедневные челленджи (Duolingo-style)
- [ ] Командные соревнования
- [ ] Социальные функции (LinkedIn-style endorsements)
- [ ] Менторство экспертов
- [ ] Вебинары и курсы (Coursera-style)

## KPI продукта

| Метрика | Target (Year 1) |
|---------|-----------------|
| MAU кандидатов | 10 000 |
| Конверсия тест → профиль | 70% |
| NPS рекрутеров | 50+ |
| Средний Skill Score | 65+ |
| Время прохождения общего теста | < 25 мин |

## Технический долг MVP

- Mock API → real backend
- Geist font → Cyrillic-optimized (Inter/PT Sans)
- Next.js 16 → stabilize on LTS
- Unit tests (Vitest) + E2E (Playwright)
- Accessibility audit (WCAG 2.1 AA)
