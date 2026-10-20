-- Administracja DB: rola z prawem odczytu w bazie task_manager_2.
-- Uruchom jako postgres w Query Tool polaczonym z task_manager_2.
-- Haslo nie jest potrzebne, poniewaz cwiczenie korzysta z SET ROLE.

CREATE ROLE userek LOGIN;
GRANT CONNECT ON DATABASE task_manager_2 TO userek;
GRANT USAGE ON SCHEMA public TO userek;
GRANT SELECT ON TABLE public.users, public.tasks, public.comment TO userek;
