-- Zadanie 4: SELECT training.
-- Uruchom po table-schema.sql i seed-data.sql w tej samej bazie PostgreSQL.

-- 1. Login i email wszystkich uzytkownikow, alfabetycznie po loginie.
SELECT login, email
FROM users
ORDER BY login ASC;

-- 2. Tytuly i statusy zakonczonych zadan.
SELECT title, status
FROM tasks
WHERE status = 'done';

-- 3. Liczba zadan w kazdym statusie, od najwiekszej liczby.
SELECT status, COUNT(*) AS task_count
FROM tasks
GROUP BY status
ORDER BY task_count DESC, status ASC;

-- 4. Tytul kazdego zadania i login jego autora.
-- W utworzonym schemacie klucz obcy nazywa sie tasks.user_id.
SELECT t.title, u.login
FROM tasks AS t
JOIN users AS u ON u.id = t.user_id
ORDER BY t.id;
