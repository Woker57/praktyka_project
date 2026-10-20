CREATE ROLE userek LOGIN;
GRANT CONNECT ON DATABASE task_manager_2 TO userek;
GRANT USAGE ON SCHEMA public TO userek;
GRANT SELECT ON TABLE public.users, public.tasks, public.comment TO userek;
