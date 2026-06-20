# РосКомпетенции — MVP платформы подтверждения компетенций

Платформа подтверждения компетенций специалистов по государственным закупкам для **Росэлторг** (интенсив 2026).

## Быстрый старт (только frontend, mock API)

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). Без переменной `NEXT_PUBLIC_API_URL` приложение работает на mock-данных.

## Полный стек (frontend + backend + PostgreSQL)

### Локальная разработка

1. PostgreSQL на порту 5432 (или через Docker — см. ниже).
2. Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

API: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)

3. Frontend (в корне проекта):

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Или одной командой из корня (нужен запущенный PostgreSQL):

```bash
npm run dev:all
```

### Docker (весь стек)

```bash
docker compose up --build
```

| Сервис | URL |
|--------|-----|
| Frontend | [http://localhost:3000](http://localhost:3000) |
| Backend API | [http://localhost:4000/api/v1](http://localhost:4000/api/v1) |
| PostgreSQL | localhost:5432 |

Остановка: `docker compose down`

### Демо-аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Кандидат | anna.petrova@example.ru | demo |
| Рекрутер | recruiter@roseltorg.ru | demo |

## Стек

**Frontend:** Next.js 16, TypeScript, Tailwind CSS 4, Zustand, React Query, Framer Motion, Recharts, @dnd-kit

**Backend:** Fastify 5, Prisma, PostgreSQL, JWT, Zod

## Структура проекта

```
src/                        # Frontend (Next.js)
backend/
├── src/
│   ├── routes/             # API endpoints
│   ├── services/           # Бизнес-логика
│   ├── middleware/         # JWT auth
│   └── data/               # topics.json, tasks.json
└── prisma/                 # Schema + seed
docs/                       # ARCHITECTURE, API, ER-DIAGRAM, ROADMAP
```

## Маршруты

| Путь | Описание |
|------|----------|
| `/` | Landing |
| `/login` | Авторизация |
| `/dashboard` | ЛК кандидата |
| `/assessment/global` | Общий адаптивный практикум |
| `/topics` | Тематические направления |
| `/topics/[id]/competency` | Практикум по теме |
| `/results` | История результатов |
| `/profile` | Профиль кандидата |
| `/recruiter` | Кабинет рекрутера |
| `/recruiter/candidates` | Список кандидатов |
| `/leaderboard` | Рейтинг |

## Документация

- [Архитектура](docs/ARCHITECTURE.md)
- [API контракты](docs/API.md)
- [ER-диаграмма](docs/ER-DIAGRAM.md)
- [Roadmap](docs/ROADMAP.md)

## Лицензия

MVP для интенсива Росэлторг © 2026
