# Administracja bazy danych — kopia i uprawnienia

## Kopia zapasowa i przywrócenie

Pierwszą kopię tabeli `public.comment` w bazie `task_manager_2` wykonano w pgAdmin 16.10.2026. Zrzut ekranu pokazuje status `Finished`. Wtedy nie usuwano tabeli z tej bazy.

![Ukończona kopia tabeli comment w pgAdmin](screenshots/backup-completed.jpg)

Pełny test odtworzenia przeprowadzono 27.10.2026 **w oddzielnej bazie** `task_manager_backup_demo_20261027`. W bazie testowej uruchomiono `database/table-schema.sql` i `database/seed-data.sql`. Kopię samej tabeli `public.comment` zapisano lokalnie w formacie Custom jako `../backup-demo/comment.backup` (plik testowy poza repozytorium). Archiwum zawierało definicję tabeli, jej dane, klucz główny i oba klucze obce.

| Krok | Polecenie lub sprawdzenie | Wynik |
|---|---|---|
| Przed usunięciem | `SELECT COUNT(*) FROM public.comment;` | 5 rekordów |
| Usunięcie w bazie testowej | `DROP TABLE public.comment;` | `DROP TABLE` |
| Potwierdzenie braku | `SELECT to_regclass('public.comment') IS NULL;` | `true` |
| Przywrócenie | `pg_restore` z archiwum Custom do bazy testowej | zakończone bez błędu |
| Sprawdzenie po przywróceniu | `SELECT id, content, task_id, user_id FROM public.comment ORDER BY id;` | 5 rekordów, jak przed usunięciem |

Właściwą kopię należy przechowywać poza komputerem z bazą, np. na zewnętrznym dysku albo serwerze. Awaria jednego dysku może zniszczyć jednocześnie bazę i kopię, jeśli oba pliki są na tym samym nośniku. Osobny folder lub litera partycji na tym samym dysku nie rozwiązuje tego problemu.

[Dokument Word z instrukcją pgAdmin i zrzutem wykonania kopii](backup-restore-pgadmin.docx). Opisany wyżej test odtworzenia odbył się później w bazie testowej, więc wcześniejszy dokument nie zawiera zrzutów z tych kroków.

## Rola tylko do odczytu

Skrypt [`database/role-select.sql`](../database/role-select.sql) tworzy rolę `userek` i nadaje jej `CONNECT`, `USAGE` oraz `SELECT` na trzech tabelach. Rola nie otrzymuje `INSERT`. Sprawdzenie wykonano w pgAdmin przez `SET ROLE userek`, a potem `RESET ROLE`.

1. Jako `userek` zapytania `SELECT` z tabel `users`, `tasks` i `comment` działały. Każda tabela miała wtedy 5 rekordów.

   ![Działający SELECT jako userek](screenshots/role-select.jpg)

2. Próba `INSERT` do `public.comment` jako `userek` zwróciła `permission denied for table comment`, kod PostgreSQL `42501`. Rekord nie został dodany.

   ![Odmowa INSERT jako userek](screenshots/role-insert-denied.jpg)

3. Po `RESET ROLE` administrator mógł wykonać `INSERT`; PostgreSQL zwrócił nowy rekord.

   ![Udany INSERT jako postgres](screenshots/admin-insert-allowed.jpg)

Pełny opis i zrzuty są również w [dokumencie Word o rolach](administracja-db-roles.docx). Wyniki ze zrzutów dotyczą bazy `task_manager_2`; test przywracania z pierwszej sekcji wykonano osobno i nie zmieniał tej bazy.
