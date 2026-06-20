# ER-диаграмма — РосКомпетенции

```mermaid
erDiagram
    USER ||--o{ ASSESSMENT_SESSION : takes
    USER ||--o{ USER_ACHIEVEMENT : earns
    USER ||--o{ TOPIC_COMPETENCY : has
    USER {
        uuid id PK
        string email
        string name
        enum role
        string organization
        timestamp created_at
    }

    TOPIC ||--o{ ASSESSMENT_TASK : contains
    TOPIC ||--o{ TOPIC_COMPETENCY : measured_in
    TOPIC {
        uuid id PK
        string slug
        string title
        string description
        int question_count
    }

    ASSESSMENT_SESSION ||--|{ TASK_ANSWER : includes
    ASSESSMENT_SESSION ||--o| ASSESSMENT_RESULT : produces
    ASSESSMENT_SESSION {
        uuid id PK
        uuid user_id FK
        enum mode
        uuid topic_id FK
        int difficulty
        enum status
        timestamp started_at
        timestamp completed_at
    }

    ASSESSMENT_TASK {
        uuid id PK
        uuid topic_id FK
        enum type
        int difficulty
        jsonb content
        jsonb source
        int time_limit
    }

    TASK_ANSWER {
        uuid id PK
        uuid session_id FK
        uuid task_id FK
        jsonb value
        boolean is_correct
        int time_spent
        int hints_used
    }

    ASSESSMENT_RESULT {
        uuid id PK
        uuid session_id FK
        uuid user_id FK
        enum global_grade
        enum competency_level
        int skill_score
        float accuracy
        int avg_response_time
        int error_count
        int hints_used
        float confidence_level
        jsonb competency_map
        text ai_summary
        timestamp completed_at
    }

    TOPIC_COMPETENCY {
        uuid id PK
        uuid user_id FK
        uuid topic_id FK
        int score
        enum level
        enum medal
        timestamp updated_at
    }

    ACHIEVEMENT ||--o{ USER_ACHIEVEMENT : granted
    ACHIEVEMENT {
        uuid id PK
        string title
        string description
        string icon
        jsonb criteria
    }

    USER_ACHIEVEMENT {
        uuid id PK
        uuid user_id FK
        uuid achievement_id FK
        timestamp unlocked_at
    }

    LEADERBOARD_ENTRY {
        uuid user_id PK
        int skill_score
        int medal_count
        int streak
        int rank
    }
```

## Индексы (production)

- `user(email)` UNIQUE
- `assessment_session(user_id, status)`
- `topic_competency(user_id, topic_id)` UNIQUE
- `assessment_result(user_id, completed_at DESC)`
- `leaderboard_entry(skill_score DESC)`

## Медали — бизнес-правила

| Score | Medal |
|-------|-------|
| ≥ 95% | Platinum |
| ≥ 85% | Gold |
| ≥ 70% | Silver |
| ≥ 50% | Bronze |

## Грейды — общий тест

| Accuracy | Global Grade |
|----------|--------------|
| ≥ 85% | expert |
| ≥ 60% | basic |
| < 60% | intern |
