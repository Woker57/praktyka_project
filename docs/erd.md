# Diagram ERD bazy Zadaniowo

Diagram odpowiada aktualnemu skryptowi [`database/table-schema.sql`](../database/table-schema.sql). Baza PostgreSQL zawiera trzy tabele: `users`, `tasks` i `comment` (liczba pojedyncza).

```mermaid
erDiagram
    users ||--o{ tasks : "user_id"
    users ||--o{ comment : "user_id"
    tasks ||--o{ comment : "task_id"

    users {
        int id PK
        varchar login UK
        varchar email UK
        varchar password_hash
        varchar role
        timestamptz created_at
    }

    tasks {
        int id PK
        varchar title
        text description
        varchar status
        varchar priority
        date due_date
        timestamptz created_at
        int user_id FK
    }

    comment {
        int id PK
        varchar content
        timestamptz created_at
        int task_id FK
        int user_id FK
    }
```

`PK` oznacza klucz główny, `FK` klucz obcy, a `UK` wartość unikalną. Jeden użytkownik może mieć wiele zadań i komentarzy. Jedno zadanie może mieć wiele komentarzy. Kolumny `tasks.priority` i `tasks.due_date` są również dodawane do starszej bazy przez [`database/migrate-task-details.sql`](../database/migrate-task-details.sql).
