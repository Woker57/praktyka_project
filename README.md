# Zadaniowo — menedżer zadań

Zadaniowo to aplikacja do planowania osobistych zadań. Frontend jest napisany w HTML, CSS i JavaScript, API w ASP.NET Core (.NET 10), a dane są zapisane w PostgreSQL. W trybie deweloperskim API udostępnia także stronę pod tym samym adresem.

## Co działa w aplikacji

- Ekran wejścia pozwala wybrać użytkownika po adresie e-mail z tabeli `users`. To **tryb demonstracyjny**, a nie logowanie: API nie sprawdza hasła i nie ma autoryzacji.
- Lista pokazuje zadania wybranego użytkownika. Można wyszukiwać po tytule, filtrować zadania i sprawdzać liczbę ukończonych.
- Formularz pozwala dodać lub edytować tytuł, opis, termin, priorytet i status zadania.
- Na liście można oznaczyć zadanie jako ukończone albo je usunąć. Po otwarciu edycji można przeczytać i dodać komentarze.
- Zmiany są wysyłane przez HTTP do API i zapisywane w PostgreSQL; po odświeżeniu strony pozostają w bazie.

Ekrany aplikacji: **wybór konta** (`/`) → **lista zadań** (`/tasks.html`) → **formularz zadania** (na tej samej stronie). W formularzu edycji pojawia się sekcja komentarzy. Wygląd projektu można porównać z [makietą w Figma](https://www.figma.com/design/B7n1bk5PJCKAuLwpqePFeU/Zadaniowo-%E2%80%94-projekt-aplikacji?node-id=1-217).

## Uruchomienie

Potrzebne są .NET 10 SDK i PostgreSQL. Polecenia uruchamiaj z głównego katalogu repozytorium.

1. W pgAdmin utwórz bazę, np. `task_manager_2`. W **nowej, pustej** bazie uruchom `database/table-schema.sql`, a następnie `database/seed-data.sql` (po pięć przykładowych rekordów w każdej tabeli). Jeśli używasz swojej wcześniejszej bazy z tabelami, uruchom tylko `database/migrate-task-details.sql`, który dodaje `priority` i `due_date` bez kasowania danych.
2. Skopiuj `backend/TaskManager.Api/appsettings.Local.example.json` do `backend/TaskManager.Api/appsettings.Local.json`. W lokalnym pliku ustaw nazwę bazy, użytkownika i hasło PostgreSQL. Ten plik jest ignorowany przez Git.
3. Uruchom API i frontend:

```cmd
dotnet run --project backend/TaskManager.Api --launch-profile http
```

4. Otwórz [http://localhost:5113/](http://localhost:5113/). Przy danych przykładowych wpisz `anna@example.com`. Sprawdź połączenie z bazą pod [http://localhost:5113/api/health/db](http://localhost:5113/api/health/db); poprawna odpowiedź to `{"database":"ok"}`.

Nie otwieraj `frontend/index.html` przez `file://`, ponieważ strona wysyła żądania do API pod tym samym adresem. Szczegółowa instrukcja i opis żądań HTTP są w [docs/URUCHOMIENIE.md](docs/URUCHOMIENIE.md).

## Baza danych i API

Baza zawiera `users`, `tasks` i `comment`. Klucze obce łączą zadania z użytkownikami, a komentarze z zadaniami i użytkownikami. [Diagram ERD](docs/erd.md) odpowiada [skryptowi tworzenia tabel](database/table-schema.sql). Przykładowe zapytania są w [select-training.sql](database/select-training.sql).

API udostępnia m.in. `GET /api/users`, `GET /api/tasks?userId=2`, `POST /api/tasks`, `PUT /api/tasks/{id}`, `PATCH /api/tasks/{id}/status`, `DELETE /api/tasks/{id}` oraz operacje na komentarzach. Przykłady żądań znajdują się w [TaskManager.Api.http](backend/TaskManager.Api/TaskManager.Api.http). Łańcuch połączenia jest odczytywany w `Program.cs` z `ConnectionStrings:TaskManagerDb` w lokalnym pliku ustawień.

## Dokumentacja z ćwiczeń

- [Kopia zapasowa i przywracanie w pgAdmin](docs/backup-restore-pgadmin.docx) oraz [opis i dowody kroków](docs/administracja-db.md).
- [Rola z dostępem tylko do odczytu — dokument ze zrzutami](docs/administracja-db-roles.docx) i [skrypt SQL](database/role-select.sql).
- [Diagram ERD](docs/erd.md) i [instrukcja uruchomienia](docs/URUCHOMIENIE.md).

Projekt służy do nauki. Wybór użytkownika na ekranie wejścia nie zabezpiecza danych; przed publicznym wdrożeniem trzeba dodać prawdziwe uwierzytelnianie i kontrolę dostępu.
