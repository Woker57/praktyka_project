# Zadaniowo

Aplikacja do zadań: frontend HTML/CSS/JavaScript, API ASP.NET Core (.NET 10) i PostgreSQL. Frontend jest udostępniany przez API pod tym samym adresem. Zadania, terminy, priorytety i komentarze zapisują się w bazie.

## Uruchomienie lokalne

1. Zainstaluj .NET 10 SDK i PostgreSQL. W pgAdmin utwórz bazę (np. `task_manager_2`).
2. Na nowej bazie uruchom `database/table-schema.sql`, potem opcjonalnie `database/seed-data.sql`. Jeśli tabele już istnieją z poprzednich zadań, uruchom tylko `database/migrate-task-details.sql`. Ten skrypt dodaje `priority` i `due_date` bez kasowania rekordów.
3. Skopiuj `backend/TaskManager.Api/appsettings.Local.example.json` do `backend/TaskManager.Api/appsettings.Local.json` i ustaw nazwę bazy oraz własne hasło PostgreSQL. Plik lokalny jest ignorowany przez Git.
4. W katalogu głównym repozytorium uruchom:

```cmd
dotnet run --project backend/TaskManager.Api --launch-profile http
```

5. Otwórz [http://localhost:5113/](http://localhost:5113/). W przykładowych danych możesz wpisać `anna@example.com`. Otwieranie strony przez `file://` nie połączy jej z API.

Ekran wejścia jest **wyborem konta demonstracyjnego**, a nie logowaniem. Szkielet API nie zawiera uwierzytelniania ani weryfikacji hasła. Nie używaj tej wersji do prywatnych danych ani nie wystawiaj API publicznie bez dodania autoryzacji.

## HTTP i połączenie z bazą

`GET /api/health` sprawdza działanie API, a `GET /api/health/db` sprawdza, czy API może połączyć się z PostgreSQL. `GET /api/tasks?userId=2` pobiera zadania użytkownika; `POST /api/tasks` tworzy zadanie i zwraca 201, `PUT /api/tasks/{id}` je edytuje, `PATCH /api/tasks/{id}/status` zmienia status, a `DELETE /api/tasks/{id}` usuwa zadanie wraz z komentarzami i zwraca 204. Błędne dane dają 400, brak rekordu 404. Przykłady są w [TaskManager.Api.http](backend/TaskManager.Api/TaskManager.Api.http).

Łańcuch połączenia znajduje się w ignorowanym pliku `appsettings.Local.json` pod kluczem `ConnectionStrings:TaskManagerDb`. `Program.cs` odczytuje go i konfiguruje dostawcę Npgsql dla Entity Framework Core. Przykład: `Host=localhost;Port=5432;Database=task_manager_2;Username=postgres;Password=...`. Hasła nie zapisujemy w repozytorium.

Statusy zadań to `todo`, `in_progress` i `done`. Skrypt z poprzedniego ćwiczenia ma tabelę `comment` (liczba pojedyncza); API korzysta z tej samej nazwy. Szczegóły backendu są w [backend/README.md](backend/README.md).
