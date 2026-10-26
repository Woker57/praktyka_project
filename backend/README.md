# TaskManager.Api

API ASP.NET Core 10 z Entity Framework Core i PostgreSQL. Uruchomienie całego projektu opisuje [główny README](../README.md).

Konfiguracja bazy: skopiuj `appsettings.Local.example.json` do `appsettings.Local.json`, wpisz nazwę bazy i hasło. Plik lokalny nie trafia do Git. Zamiast pliku możesz ustawić zmienną środowiskową `ConnectionStrings__TaskManagerDb`.

Schemat nowej bazy: [table-schema.sql](../database/table-schema.sql). Dla bazy z wcześniejszych zadań: [migrate-task-details.sql](../database/migrate-task-details.sql). API nie wykonuje migracji automatycznie. Tabele: `users`, `tasks`, `comment`.

Uruchom z katalogu głównego repozytorium: `dotnet run --project backend/TaskManager.Api --launch-profile http`. Adres: `http://localhost:5113/`. Przykładowe żądania: [TaskManager.Api.http](TaskManager.Api/TaskManager.Api.http). Dostęp do zadań i wybór użytkownika są demonstracyjne; API nie ma uwierzytelniania.
