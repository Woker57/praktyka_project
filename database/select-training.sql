SELECT login, email
FROM users
ORDER BY login ASC;

SELECT title, status
FROM tasks
WHERE status = 'done';

SELECT status, COUNT(*) AS task_count
FROM tasks
GROUP BY status
ORDER BY task_count DESC, status ASC;

SELECT t.title, u.login
FROM tasks AS t
JOIN users AS u ON u.id = t.user_id
ORDER BY t.id;
