# API Contracts — РосКомпетенции

Base URL: `/api/v1` (mock реализован в `src/services/api/client.ts`)

## Auth

### POST /auth/login
```json
// Request
{ "email": "string", "password": "string", "role": "candidate" | "recruiter" }

// Response 200
{ "user": User, "token": "string" }
```

## Topics

### GET /topics
```json
// Response 200
{ "topics": Topic[] }
```

### GET /topics/:id
```json
// Response 200
Topic
```

## Assessment

### POST /assessment/start
```json
// Request
{ "mode": "global" | "competency" | "basic" | "medium" | "hard", "topicId"?: TopicId }

// Response 200
{ "session": AssessmentSession }
```

### POST /assessment/:sessionId/answer
```json
// Request
{ "answer": TaskAnswer }

// Response 200
{ "session": AssessmentSession, "nextTask"?: AssessmentTask, "isComplete": boolean }
```

### POST /assessment/:sessionId/complete
```json
// Response 200
{ "result": AssessmentResult }
```

## Profile

### GET /profile
```json
// Response 200
{ "profile": CandidateProfile }
```

### GET /results
```json
// Response 200
{ "results": AssessmentResult[] }
```

## Recruiter

### GET /recruiter/candidates
Query: `grade`, `topicId`, `medal`, `minRating`, `dateFrom`, `dateTo`, `search`, `page`, `pageSize`

```json
// Response 200
{ "candidates": CandidateListItem[], "total": number }
```

### GET /recruiter/candidates/:id
```json
// Response 200
{ "candidate": CandidateProfile }
```

## Leaderboard

### GET /leaderboard
```json
// Response 200
{ "entries": LeaderboardEntry[], "currentUserRank"?: number }
```

## Error Format
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Human readable message",
  "details": { "field": ["error1"] }
}
```

## TypeScript Models

See `src/types/index.ts` and `src/types/api.ts`
