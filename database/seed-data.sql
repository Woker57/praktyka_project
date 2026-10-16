BEGIN;
INSERT INTO users (login, email, password_hash, role)
VALUES
    ('admin', 'admin@example.com', 'hash-placeholder-1', 'admin'),
    ('anna', 'anna@example.com', 'hash-placeholder-2', 'user'),
    ('piotr', 'piotr@example.com', 'hash-placeholder-3', 'user'),
    ('ola', 'ola@example.com', 'hash-placeholder-4', 'user'),
    ('marek', 'marek@example.com', 'hash-placeholder-5', 'user')
ON CONFLICT (login) DO NOTHING;

INSERT INTO tasks (title, description, status, user_id)
SELECT seed.title, seed.description, seed.status, users.id
FROM (VALUES
    ('Przygotować makietę', 'Ekran listy i formularza', 'done', 'anna'),
    ('Dodać ekran logowania', 'Formularz logowania użytkownika', 'in_progress', 'piotr'),
    ('Sprawdzić kolory', 'Zweryfikować kontrast tekstu', 'todo', 'ola'),
    ('Opisać bazę danych', 'Uzupełnić dokumentację tabel', 'todo', 'marek'),
    ('Przetestować aplikację', 'Sprawdzić listę zadań', 'in_progress', 'admin')
) AS seed(title, description, status, login)
JOIN users ON users.login = seed.login
WHERE NOT EXISTS (
    SELECT 1 FROM tasks WHERE tasks.title = seed.title
);

INSERT INTO comment (content, task_id, user_id)
SELECT seed.content, tasks.id, users.id
FROM (VALUES
    ('Makieta została zatwierdzona.', 'Przygotować makietę', 'admin'),
    ('Dodaj pole hasła i przycisk logowania.', 'Dodać ekran logowania', 'anna'),
    ('Kontrast tekstu wymaga poprawy.', 'Sprawdzić kolory', 'piotr'),
    ('Dopisz opis kluczy obcych.', 'Opisać bazę danych', 'ola'),
    ('Lista zadań działa poprawnie.', 'Przetestować aplikację', 'marek')
) AS seed(content, task_title, login)
JOIN tasks ON tasks.title = seed.task_title
JOIN users ON users.login = seed.login
WHERE NOT EXISTS (
    SELECT 1 FROM comment
    WHERE comment.content = seed.content
      AND comment.task_id = tasks.id
      AND comment.user_id = users.id
);

COMMIT;
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'comment', COUNT(*) FROM comment
ORDER BY table_name;
